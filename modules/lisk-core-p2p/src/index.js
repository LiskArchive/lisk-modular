'use strict';

module.exports = {
	alias: 'p2p',
	pkg: require('../package.json'),
	defaults: {},
	events: [
		'peerAdded',
		'newPeer'
	],
	actions: [
		'verifyPeer'
	],
	async load (channel, options) {

		const loggerConfig = await channel.invoke('lisk:getComponentConfig', 'logger');
		const logger = require('@lisk/lisk-logger-bunyan')(loggerConfig).child({identifier: 'p2p'});

		// Subscribe to event
		channel.subscribe('p2p:newPeer', (event) => {
			logger.info(event.toString(), event);
		});

		// Register actions
		channel.action('verifyPeer', async (action) => {
			logger.info(action.toString(), action);
			if(action.params.nonce % 10 < 5) {
				return {error: false};
			} else {
				return {error: true, message: 'Invalid peer'};
			}
		});

		channel.once('lisk:ready', () => {
			setInterval(async () => {

				const id = Math.floor(Math.random() * Math.floor(100000));
				const amount = Math.floor(Math.random() * Math.floor(100000000));

				const transaction = { id, amount };
				const result = await channel.invoke('chain:verifyTransaction', transaction);

				if (result && !result.error) {
					channel.publish('chain:newTransaction', transaction);
				} else {
					logger.error('Transaction verification failed....')
				}

			}, 2000);
		});
	},
	async unload (controller, options) {
	}
};
