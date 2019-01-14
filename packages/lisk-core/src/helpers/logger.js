const config = require('../helpers/config');
const logger = require('@lisk/lisk-logger-bunyan')(config.components.logger);

console.log('logger created');

module.exports = logger;
