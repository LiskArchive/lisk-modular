const createLogger = require('@lisk/lisk-logger-bunyan');

module.exports = class Chain {
	constructor(channel, options) {
		this.channel = channel;
		this.options = options;
		this.logger = null;
	}

	async bootstrap() {
		const loggerConfig = await this.channel.invoke(
			'lisk:getComponentConfig',
			'logger',
		);
		this.logger = createLogger(loggerConfig).child({ identifier: 'chain' });

		this.channel.subscribe(
			'chain:newTransaction',
			this.onNewTransaction.bind(this),
		);
		this.channel.action('verifyTransaction', this.verifyTransaction.bind(this));

		setInterval(async () => {
			const peer = {
				ip: '192.168.99.100',
				nonce: Math.floor(Math.random() * Math.floor(100000)),
			};

			const result = await this.channel.invoke('p2p:verifyPeer', peer);

			if (result && !result.error) {
				this.channel.publish('p2p:newPeer', peer);
			} else {
				this.logger.error('Peer verification failed....');
			}
		}, 2000);
	}

	onNewTransaction(event) {
		this.logger.info(event.toString(), event);
	}

	async verifyTransaction(action) {
		this.logger.info(action.toString(), action);
		if (action.params.amount % 10 < 5) {
			return { error: false };
		}
		return { error: true, message: 'Very low amount' };
	}
};
