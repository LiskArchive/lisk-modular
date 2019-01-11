const logger = require('@lisk/lisk-logger-bunyan');
const config = require('./config');

module.exports = logger(config.components.logger);
