'use strict';

const P2P = require('./p2p');

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
		const p2p = new P2P(channel, options);
		channel.once('lisk:ready', p2p.bootstrap.bind(p2p));
	},
	async unload (controller, options) {
	}
};
