const logger = require('../../helpers/logger');
const Controller = require('../../controller');

module.exports = async function start(options = {}) {
	logger.info('CMD start');
	logger.debug('CMD start called with options', options);
	return Controller.start(options);
};
