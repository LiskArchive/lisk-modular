/* eslint-disable */

// Comes from framework
const { Application } = require('../framework/src');
const Chain = require('../framework/src/modules/lisk-core-chain');
const P2P = require('../framework/src/modules/lisk-core-p2p');

const config = require('my/config');
const genesisBlock = require('my/genesiBlock');
const overrideConstants = require('my/constants');
const exceptions = require('my/exceptions');
const logger = require('my/logger');

// Dummy Transaction Logic
const DappTransaction = {};

class MultisigTransaction {
	constructor(storage, accountLogic, validator, logger) {}
}

const app = new Application(genesisBlock, overrideConstants, {
	exceptions,
	logger,
});

// Module override configuration
app.registerModule(Chain, {
	...Chain.defaults,
	...config.modules[Chain.alias],
});

app.registerModule(P2P, {
	...P2P.defaults,
	...config.modules[Chain.alias],
});

app.getTransactions(); // returns ['Transfer', 'SecondSignature', 'Delegate', 'Vote']

class Transfer {
	match(t, status) {
		return t.type === 0;
	}
}

class BaseTransaction {
	match(t, status) {
		throw new UnimplentedMethod('');
	}
}

class Vote extends BaseTransaction {
	static get type() {
		return 0;
	}

	match(t, status) {
		return t.type === 0 && status.height < 1000;
	}
}

class NewVote extends Vote {
	match(t, status) {
		return t.type === 0;
	}
}

app.registerTransaction(Transfer, 'Multisig');
app.registerTransaction(Vote, 'Vote');

app.registerTransaction(MultisigTransaction, t => t.type === 4, 'Multisig');
app.registerTransaction(
	DappTransaction,
	(t, status) => t.type === 5 && status.height < 100000,
	'Dapp',
);
app.registerTransaction(
	DappTransaction,
	(t, status) => t.type === 5 && status.height >= 100000,
	'AdvanceDapp',
);

app.on('exit').then((code, message) => {
	console.log(`[${code}] - ${message} - Bye bye... `);
});

app.run();
