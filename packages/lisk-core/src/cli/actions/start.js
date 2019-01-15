const logger = require('../../helpers/logger');
const Controller = require('../../controller');
const bus = require('../../bus');

module.exports = async function start(options = {}) {
	logger.info('CMD start');
	logger.debug('CMD start called with options', options);
	const controller = new Controller();
	try {
		await bus.setup();
		await controller.start(options);
	} catch (err) {
		// This will resolve unhandled promise rejection warning!
		console.error(err);
	}
};
