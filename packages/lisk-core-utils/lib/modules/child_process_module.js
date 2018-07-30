'use strict';

const ChildProcess = require('child_process');
const path = require('path');
const BaseModule = require('./base');
const EventEmitterChannel = require('../channels/event_emitter');

module.exports = class ChildProcessModule extends BaseModule {

	constructor(moduleName, options={}, bus){
		super(moduleName, options);
		this.bus = bus;
	}

	async load(){
		console.log(`Loading module with alias: ${this.alias}(${this.version})`);
		this.moduleProcess = ChildProcess.fork(
			`${path.resolve(__dirname, '../loaders/child_process')}`, [
				`${this.name}`,
				JSON.stringify(this.options)
		], {
			cwd: process.cwd(),
			stdio: [process.stdin, process.stdout, process.stderr, 'ipc'],
			uid: process.getuid(),
			gid: process.getgid(),
			env: {
				// Add Debugging Flags
			}
		});
		await this.establishChannel();
		//await super.load();
	}

	async establishChannel(){
		this.channel = new EventEmitterChannel(this, this.bus, {});
		await this.channel.registerToBus();
	}
};