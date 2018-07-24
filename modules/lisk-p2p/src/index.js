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

		// Subscribe to event
		channel.subscribe('p2p:newPeer', (peer) => {
			console.log('[p2p] event - p2p2:newPeer', peer);
		});

		// Register actions
		channel.action('verifyPeer', async (peer) => {
			if(peer.nonce % 10 < 5) {
				return {error: false};
			} else {
				return {error: true, message: 'Invalid peer'};
			}
		});

		setInterval(async () => {

			const id = Math.floor(Math.random() * Math.floor(100000));
			const amount = Math.floor(Math.random() * Math.floor(100000000));

			const transaction = {id , amount};
			const result = await channel.invoke('chain:verifyTransaction', transaction);

			if(result && !result.error) {
				channel.publish('chain:newTransaction', transaction);
			} else {
				console.error('[p2p] Transaction verification failed....')
			}

		}, 2000);

		console.log('Module chain loaded...');
	},
	async unload (controller, options) {
	}
};
