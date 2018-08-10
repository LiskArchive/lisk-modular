const { ComponentFactory } = require('@lisk/core-utils');
const pkg = require('../package');
const config = require('../config/config.json');

ComponentFactory.register('logger', require('@lisk/lisk-logger-bunyan'));
const logger = ComponentFactory.create('logger', config.components.logger);

const Controller = require('./controller');

let ctrl = null;

const setProcessTitle = () => {
	process.title = `Lisk ${pkg.version} : (${process.cwd()})`;
};

module.exports = {
	start: async (options = {}) => {
		logger.info('Starting lisk...');
		if (ctrl) {
			logger.error('Controller is already started...');
			return;
		}

		setProcessTitle();
		ctrl = new Controller(Object.assign({}, options, config));
		await ctrl.load();
	},
};
