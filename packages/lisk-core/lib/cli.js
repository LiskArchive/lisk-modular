'use strict';
const pkg = require('../package');
const config = require('../config/config.json');
const { ComponentFactory } = require('@lisk/core-utils');

ComponentFactory.register('logger', require('@lisk/lisk-logger-bunyan'));

const Controller = require('./controller');

const logger = ComponentFactory.create('logger', config.components.logger);

let ctrl = null;

module.exports = {
	start: async (options = {}) => {
		logger.info('Starting lisk...');
		if(ctrl) {
			logger.error('Controller is already started...');
			return;
		}

		setProcessTitle();
		ctrl = new Controller(Object.assign({}, options, config));
		await ctrl.load();
	}
};

const setProcessTitle = () => {
	process.title = `Lisk ${pkg.version} : (${process.cwd()})`;
};
