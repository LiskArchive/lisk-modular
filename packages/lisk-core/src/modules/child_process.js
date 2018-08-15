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
	constructor(moduleName, options = {}, logger, bus) {
		super(moduleName, options, logger);
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
			args: [`${this.name}`, JSON.stringify(this.options)],
			exec: `${childProcessLoaderPath}`,
		});
		this.childProcess = cluster.fork();

		this.rpcClient = null;

		return new Promise((resolve, reject) => {
			const onChildProcessReady = data => {
				if (data === 'ready') {
					this.childProcess.removeListener('message', onChildProcessReady);

					// Forward bus message to child process
					this.bus.onAny((name, event) => {
						this.childProcess.send(event);
					});

					// Receive message from child process and send to bus
					this.childProcess.on('message', eventData => {
						const event = Event.deserialize(eventData);
						this.bus.emit(event.key(), event.serialize());
					});

					// Create socket for module
					const moduleSocket = axon.socket('req');
					const moduleSocketPath = `${config.dirs.sockets}/${
						this.alias
					}_rpc.sock`;
					this.rpcClient = new rpc.Client(moduleSocket);
					moduleSocket.connect(`unix://${moduleSocketPath}`);

					return setImmediate(resolve);
				}
				return setImmediate(
					reject,
					new Error('Child process sent some other event than ready.'),
				);
			};

			this.childProcess.on('message', onChildProcessReady);
		})
			.timeout(5000)
			.then(() => {
				this.logger.info(
					`Ready module with alias: ${this.alias}(${this.version})`,
				);
			});
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
		const modulePackage = require(`${config.dirs.modules}/${moduleName}`);

		process.title = `${modulePackage.alias} (${modulePackage.pkg.version})`;

		const channel = new ChildProcessChannel(
			modulePackage.alias,
			modulePackage.events,
			modulePackage.actions,
			{},
		);
		await channel.registerToBus();
		await modulePackage.load(channel, moduleOptions).then(() => {
			process.send('ready');
		});
	}
};
