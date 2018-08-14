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

		const loggerConfig = await channel.invoke('lisk:getComponentConfig', 'logger');
		const logger = require('@lisk/lisk-logger-bunyan')(loggerConfig).child({identifier: 'chain'});

		// Subscribe to event
		channel.subscribe('chain:newTransaction', (event) => {
			logger.info(event.toString(), event);
		});

		// Register actions
		channel.action('verifyTransaction', async (action) => {
			logger.info(action.toString(), action);
			if(action.params.amount % 10 < 5) {
				return {error: false};
			} else {
				return {error: true, message: 'Very low amount'};
			}
		});

		channel.once('lisk:ready', () => {
			setInterval(async () => {

				const peer = {ip: '192.168.99.100', nonce: Math.floor(Math.random() * Math.floor(100000))};

				const result = await channel.invoke('p2p:verifyPeer', peer);

				if(result && !result.error) {
					channel.publish('p2p:newPeer', peer);
				} else {
					logger.error('Peer verification failed....')
				}

			}, 2000);
		});
	},
	async unload (controller, options) {
	}
};
