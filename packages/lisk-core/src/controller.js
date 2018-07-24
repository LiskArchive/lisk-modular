'use strict';

const { ModuleFactory } = require('@lisk-core/utils');
const Bus = require('./bus');
const Promise = require('bluebird');

module.exports = class Controller {
	constructor(options) {
		console.log('Initializing controller');
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
		const chainModule = ModuleFactory.create('child_process', 'lisk-chain', {}, this, this.bus);
		const p2p2Module = ModuleFactory.create('in_memory', 'lisk-p2p', {}, this, this.bus);

		this.modules[chainModule.alias] = chainModule;
		this.modules[p2p2Module.alias] = p2p2Module;

		await Promise.map(Object.keys(this.modules), async (m) => {
			await this.modules[m].load();
		});

		console.info(`Bus listening to events: ${this.bus.getEvents()}`);
		console.info(`Bus ready for actions: ${this.bus.getActions()}`);
	}

	getModule(alias) {
		return this.modules[alias];
	}
};
