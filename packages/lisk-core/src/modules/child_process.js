const path = require('path');
const cluster = require('cluster');
const Promise = require('bluebird');
const axon = require('axon');
const rpc = require('axon-rpc');
const ChildProcessChannel = require('../channels/child_process');
const Event = require('../event');
const config = require('../helpers/config');
const BaseModule = require('./base');

const childProcessLoaderPath = path.resolve(
	__dirname,
	'../loaders/child_process',
);

module.exports = class ChildProcessModule extends BaseModule {
	constructor(npmPackageName, options = {}, logger, bus) {
		super(npmPackageName, options, logger);
		this.bus = bus;
		this.type = 'child_process';
	}

	async load() {
		this.logger.info(
			`Loading module with alias: ${this.alias}(${this.version})`,
		);
		cluster.setupMaster({
			cwd: config.dirs.root,
			stdio: [process.stdin, process.stdout, process.stderr, 'ipc'],
			uid: process.getuid(),
			gid: process.getgid(),
			execArgv: process.execArgv,
			args: [`${this.packgeName}`, JSON.stringify(this.options)],
			exec: `${childProcessLoaderPath}`,
		});
		this.childProcess = cluster.fork();

		this.rpcClient = null;

		// Receive message from child process and send to bus
		this.childProcess.on('message', (eventData) => {
			const event = Event.deserialize(eventData);
			this.bus.emit(event.key(), event.serialize());
		});

		// Forward bus message to child process
		this.bus.onAny((name, event) => {
			this.childProcess.send(event);
		});

		return (
			new Promise((resolve) => {
				this.bus.once(`${this.alias}:loading:finished`, () => {
					// Create socket for module
					this.rpcSocket = axon.socket('req');
					const moduleSocketPath = `${config.dirs.sockets}/${
						this.alias
					}_rpc.sock`;
					this.rpcClient = new rpc.Client(this.rpcSocket);
					this.rpcSocket.connect(`unix://${moduleSocketPath}`);

					return setImmediate(resolve);
				});
			})
				// Wait for 5 seconds to load the module
				.timeout(5000)
				.then(() => {
					this.logger.info(
						`Ready module with alias: ${this.alias}(${this.version})`,
					);
				})
		);
	}

	async unload() {
		this.childProcess.kill('SIGINT');

		return new Promise((resolve) => {
			this.bus.once(`${this.alias}:unloading:finished`, () =>
				setImmediate(resolve),
			);
		}).timeout(50000);
	}

	async invoke(action) {
		return new Promise((resolve, reject) => {
			this.rpcClient.call('invoke', action, (err, result) => {
				if (err) return setImmediate(reject, err);

				return setImmediate(resolve, result);
			});
		});
	}

	// This method will be called from the forked process only
	static async forkProcess(moduleName, moduleOptions) {
		if (cluster.isMaster) {
			this.logger.fatal("You can't call this method on master process.");
			process.exit(1);
		}

		// eslint-disable-next-line global-require, import/no-dynamic-require
		const modulePackage = require(moduleName);

		process.title = `${modulePackage.alias} (${modulePackage.pkg.version})`;

		const channel = new ChildProcessChannel(
			modulePackage.alias,
			modulePackage.events,
			modulePackage.actions,
			{},
		);
		await channel.registerToBus();
		channel.publish(`${modulePackage.alias}:registeredToBus`);

		process.once('SIGINT', () => {
			channel.publish(`${modulePackage.alias}:unloading:started`);
			modulePackage.unload(channel, moduleOptions).then(() => {
				channel.busRpcSocket.close();
				channel.rpcSocket.close();
				channel.publish(`${modulePackage.alias}:unloading:finished`);
				process.exit(0);
			});
		});

		channel.publish(`${modulePackage.alias}:loading:started`);
		return modulePackage.load(channel, moduleOptions).then(() => {
			channel.publish(`${modulePackage.alias}:loading:finished`);
		});
	}
};
