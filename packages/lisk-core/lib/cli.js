'use strict';
const Controller = require('./controller');
const pkg = require('../package');


let ctrl = null;

module.exports = {
	start: async (options = {}) => {
		console.log('Starting lisk...');
		if(ctrl) {
			console.error('Controller is already started...');
			return;
		}

		setProcessTitle();
		const defaultConfig = require('../config/config.json');
		ctrl = new Controller(Object.assign({}, options, defaultConfig));
		await ctrl.loadModules();
	}
};

const setProcessTitle = () => {
	process.title = `Lisk ${pkg.version} : (${process.cwd()})`;
};
