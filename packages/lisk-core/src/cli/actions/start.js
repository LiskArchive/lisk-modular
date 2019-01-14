const logger = require('../../helpers/logger');
const Controller = require('../../controller');

module.exports = async function start(options = {}) {
	logger.info('CMD start');
	logger.debug('CMD start called with options', options);
	const controller = new Controller();
	try {
		await controller.start(options);
	} catch (err) {
		// This will resolve unhandled promise rejection warning!
		console.error(err);
	}
};
