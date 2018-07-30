'use strict';

const BaseModule = require('./base');
const EventEmitterChannel = require('../channels/event_emitter');

module.exports = class InMemoryModule extends BaseModule {

	constructor(moduleName, options={}, bus){
		super(moduleName, options);
		this.type = 'in_memory';
		this.bus = bus;
	}

	async load(){
		console.log(`Loading module with alias: ${this.alias}(${this.version})`);
		this.channel = new EventEmitterChannel(this, this.bus, {});

		await this.channel.registerToBus();
		await this.getPackageSpecs().load(this.channel, this.options);
	}

	async unload() {
		await this.getPackageSpecs().unload();
	}

	async invoke(actionName, params) {
		return this.channel.invoke(actionName, params);
	}
};