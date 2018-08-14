'use strict';

const Chain = require('./chain');

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
		const blockChain = new Chain(channel, options);
		channel.once('lisk:ready', blockChain.bootstrap.bind(blockChain));
	},
	async unload (controller, options) {
	}
};
