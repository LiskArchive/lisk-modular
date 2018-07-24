'use strict';

const path = require('path');
const Controller = require('./controller');
const pkg = require('../package');


let ctrl = null;

module.exports = {
	start: async (options) => {
		console.log('Starting lisk...');
		if(ctrl) {
			console.error('Controller is already started...');
			return;
		}

		setProcessTitle();
		ctrl = new Controller(options);
		await ctrl.loadModules();
	}
};

const setProcessTitle = () => {
	process.title = `Lisk ${pkg.version} : (${process.cwd()})`;
};