'use strict';

const BaseModule = require('./base');
const SocketChannel = require('../channels/socket');

module.exports = class ChildProcessModule extends BaseModule {

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
		this.channel = new SocketChannel(this, {});
		await this.channel.registerToBus();
	}
};