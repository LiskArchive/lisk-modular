const logger = require('../../helpers/logger');
const Controller = require('../../controller');

async function start(options = {}) {
	logger.info('CMD start');
	logger.debug('CMD start called with options', options);
	return Controller.start(options);
}

module.exports = start;
