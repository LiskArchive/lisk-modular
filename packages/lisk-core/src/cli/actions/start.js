const config = require('../../helpers/config');
const Controller = require('../../controller');
const ComponentFactory = require('../../factories/components');

const logger = ComponentFactory.create('logger', config.components.logger);

module.exports = async function start(options = {}) {
	logger.info('CMD start');
	logger.debug('CMD start called with options', options);
	return Controller.start(options);
};
