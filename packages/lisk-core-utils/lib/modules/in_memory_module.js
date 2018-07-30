'use strict';

const BaseModule = require('./base');
const EventEmitterChannel = require('../channels/event_emitter');

module.exports = class InMemoryModule extends BaseModule {

	constructor(moduleName, options={}, bus){
		super(moduleName, options);
		this.bus = bus;
	}

	async load(){
		console.log(`Loading module with alias: ${this.alias}(${this.version})`);
		await this.establishChannel();
		await super.load();
	}

	async establishChannel(){
		this.channel = new EventEmitterChannel(this, this.bus, {});
		await this.channel.registerToBus();
	}
};