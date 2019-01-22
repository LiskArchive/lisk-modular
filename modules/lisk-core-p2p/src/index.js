const packageJSON = require('../package.json');
const P2P = require('./p2p');

let p2p;

const {version, author, name} = packageJSON;

module.exports = {
	alias: 'p2p',
	author, 
	version,
	name,
	defaults: {},
	events: ['peerAdded', 'newPeer'],
	actions: ['verifyPeer'],
	async load(channel, options) {
		p2p = new P2P(channel, options);
		channel.once('lisk:ready', p2p.bootstrap.bind(p2p));
	},
	// eslint-disable-next-line no-unused-vars
	async unload(channel, options) {
		p2p.logger.info('Unloading module p2p');
	},
};
