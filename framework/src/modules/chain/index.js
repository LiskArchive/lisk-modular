const Chain = require('./chain');

let blockChain = null;

module.exports = {
	alias: 'chain',
	info: {
		author: 'Lisk HT',
		version: '0.0.1',
		name: 'lisk-core-chain',
	},
	defaults: {},
	events: ['newTransaction', 'newBlock', 'forgingStatusChange'],
	actions: {
		verifyTransaction: action => {
			blockChain.verifyTransaction(action);
		},
	},
	async load(channel, options) {
		blockChain = new Chain(channel, options);
		channel.once('lisk:ready', blockChain.bootstrap.bind(blockChain));
	},
	// eslint-disable-next-line no-unused-vars
	async unload(channel, options) {
		blockChain.logger.info('Unloading module chain');
	},
};
