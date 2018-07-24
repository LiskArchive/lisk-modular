'use strict';

module.exports = {
	alias: 'chain',
	pkg: require('../package.json'),
	defaults: {},
	events: [
		'newTransaction',
		'newBlock',
		'forgingStatusChange'
	],
	actions: [
		'verifyTransaction'
	],
	async load (channel, options) {

		// Subscribe to event
		channel.subscribe('chain:newTransaction', (transaction) => {
			console.log('[chain] event - chain:newTransaction', transaction);
		});

		// Register actions
		channel.action('verifyTransaction', async (transaction) => {
			if(transaction.amount % 10 < 5) {
				return {error: false};
			} else {
				return {error: true, message: 'Very low amount'};
			}
		});

		setInterval(async () => {

			const peer = {ip: '192.168.99.100', nonce: Math.floor(Math.random() * Math.floor(100000))};

			const result = await channel.invoke('p2p:verifyPeer', peer);

			if(result && !result.error) {
				channel.publish('p2p:newPeer', peer);
			} else {
				console.error('[chain] peer verification failed....')
			}

		}, 2000);

		console.log('Module chain loaded...');
	},
	async unload (controller, options) {
	}
};
