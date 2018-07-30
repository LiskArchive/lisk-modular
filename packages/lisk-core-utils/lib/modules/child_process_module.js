'use strict';

const path = require('path');
const cluster = require('cluster');
const Promise = require('bluebird');
const BaseModule = require('./base');
const ChildProcessChannel = require('../channels/child_process');
const childProcessLoaderPath = path.resolve(__dirname, '../loaders/child_process');

module.exports = class ChildProcessModule extends BaseModule {

	constructor(moduleName, options={}, bus){
		super(moduleName, options);
		this.bus = bus;
		this.type = 'child_process';
	}

	async load(){
		console.log(`Loading module with alias: ${this.alias}(${this.version})`);
		cluster.setupMaster({
			cwd: process.cwd(),
			stdio: [process.stdin, process.stdout, process.stderr, 'ipc'],
			uid: process.getuid(),
			gid: process.getgid(),
			execArgv: [],
			args: [
				`${this.name}`,
				JSON.stringify(this.options)
			],
			exec: `${childProcessLoaderPath}`
		});
		this.childProcess = cluster.fork();

		this.events.map((eventName) => {
			this.bus.on(`${this.alias}:${eventName}`, (data) => {
				this.childProcess.send({eventName: `${this.alias}:${eventName}`, eventData: data});
			});
		});

		this.childProcess.on('message', (data) => {
			this.bus.emit(data.eventName, data.eventData);
		});

		return new Promise((resolve, reject) => {
			this.childProcess.on('online', resolve);
		}).timeout(5000).bind(this);
	}

	async invoke(actionName, params) {
		return {error: false};
	}

	// This method will be called from the forked process only
	static forkProcess(moduleName, moduleOptions){
		if(cluster.isMaster) {
			throw 'You can\'t call this method on master process.';
			process.exit(1);
		}

		const busProxy = {
			registerEvents: async (events) => {

			},
			registerActions: async (actions) => {

			}
		};

		const modulePackage = new BaseModule(moduleName, moduleOptions);

		console.log(`Loading child process for ${modulePackage.alias}(${modulePackage.pkg.version})...`);

		process.title = `${modulePackage.alias} (${modulePackage.pkg.version})`;

		const channel = new ChildProcessChannel(modulePackage, null, {});

		channel.registerToBus().then(() => {
			return modulePackage.getPackageSpecs().load(channel, moduleOptions);
		}).then(() => {
			console.log(`Child process for ${modulePackage.alias} (${modulePackage.pkg.version}) loaded...`);
		});
	}
};