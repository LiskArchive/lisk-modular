const liskBunyan = require('@lisk/lisk-logger-bunyan');
const config = require('../helpers/config');

const logger = liskBunyan(config.components.logger);

module.exports = logger;
