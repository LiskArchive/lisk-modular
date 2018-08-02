'use strict';

const Promise = require('bluebird');
const { ModuleFactory } = require('@lisk/core-utils');
const Bus = require('./bus');

module.exports = class Controller {
	constructor(options) {
		console.log('Initializing controller');
		this.config = options;
		this.modules = {};

		// Setting up bus
		if(!this.bus) {
			this.bus = new Bus(this, {
				wildcard: true,
				delimiter: ':',
				maxListeners: 1000
			});
		}
	}

	async loadModules() {
		Object.keys(this.config.modules).map(moduleName => {
			const moduleConfig = this.config.modules[moduleName];
			const module = ModuleFactory.create(moduleConfig.loadAs, moduleName, moduleConfig, this, this.bus);
			this.modules[module.alias] = module;
		});
		
		await Promise.map(Object.keys(this.modules), (m) => {
			return this.modules[m].load();
		});

		console.info(`Bus listening to events: ${this.bus.getEvents()}`);
		console.info(`Bus ready for actions: ${this.bus.getActions()}`);
	}

	getModule(alias) {
		return this.modules[alias];
	}
};
