// const createLogger = require('@lisk/lisk-logger-bunyan');

module.exports = class P2P {
	constructor(channel, options) {
		this.channel = channel;
		this.options = options;
		this.logger = null;
	}

	async bootstrap() {
		// const loggerConfig = await this.channel.invoke(
		// 	'lisk:getComponentConfig',
		// 	'logger',
		// );
		// this.logger = createLogger(loggerConfig).child({ identifier: 'p2p' });
		this.logger = console;

		this.channel.subscribe('p2p:newPeer', this.onNewPeer.bind(this));
		this.channel.action('verifyPeer', this.verifyPeer.bind(this));

		setInterval(async () => {
			const id = Math.floor(Math.random() * Math.floor(100000));
			const amount = Math.floor(Math.random() * Math.floor(100000000));

			const transaction = { id, amount };
			const result = await this.channel.invoke(
				'chain:verifyTransaction',
				transaction,
			);

			if (result && !result.error) {
				this.channel.publish('chain:newTransaction', transaction);
			} else {
				this.logger.error('Transaction verification failed....');
			}
		}, 2000);
	}

	onNewPeer(event) {
		this.logger.info(event.toString(), event);
	}

	async verifyPeer(action) {
		this.logger.info(action.toString(), action);
		if (action.params.nonce % 10 < 5) {
			return { error: false };
		}
		return { error: true, message: 'Invalid peer' };
	}
};
