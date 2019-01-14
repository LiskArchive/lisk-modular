const Promise = require('bluebird');
const fs = require('fs-extra');
const config = require('./helpers/config');
const ModuleFactory = require('./factories/modules');
const logger = require('./helpers/logger');
const EventEmitterChannel = require('./channels/EventEmitterChannel');
const Schema = require('./helpers/schema');
const Bus = require('./bus');

class Controller {
	async init(options) {
		logger.info('Initializing controller');
		// Why passing whole config object?
		this.config = { ...config, ...options };
		this.modules = [];
		this.channel = null;

		// Schema setup most be done before validations
		await Schema.validate(this.config);

		// Setting up bus
		this.bus = new Bus(this, {
			wildcard: true,
			delimiter: ':',
			maxListeners: 1000,
		});
	}

	prepareWorkspace() {
		// Empty temp directory
		fs.emptyDirSync(this.config.dirs.temp);

		// Make sure all directories exists
		Object.values(this.config.dirs).forEach(dir => fs.ensureDirSync(dir));

		// write process.pid
		fs.writeFileSync(`${this.config.dirs.pids}/controller.pid`, process.pid);
	}

	async setup() {
		this.prepareWorkspace();

		process.title = `Lisk ${this.config.pkg.version} : (${
			this.config.dirs.root
		})`;

		// Set the custom directory to load modules
		if (this.config.dirs.modules) {
			logger.info(`Setting custom module directory to: ${this.config.dirs.modules}`);
		}

		// Setup bus RPC socket
		await this.bus.setup();
	}

	async load() {
		await this.establishChannel();
		await this.loadModules();

		logger.info('Bus listening to events', this.bus.getEvents());
		logger.info('Bus ready for actions', this.bus.getActions());

		this.channel.publish('lisk:ready', {});
	}

	getModule(alias) {
		return this.modules[alias];
	}

	async establishChannel() {
		this.channel = new EventEmitterChannel(
			'lisk',
			['ready'],
			['getComponentConfig'],
			this.bus,
			{ skipInternalEvents: true },
		);

		await this.channel.registerToBus();

		this.channel.action(
			'getComponentConfig',
			async action => this.config.components[action.params],
		);

		// If log level is greater than info
		if (logger.level() < 30) {
			this.bus.onAny((name, event) => {
				logger.debug(
					`MONITOR: ${event.source} -> ${event.module}:${event.name}`,
					event.data,
				);
			});
		}
	}

	async loadModules() {
		this.config.modules.forEach((moduleConfig) => {
			const npmPackage = this.config.dirs.modules
				? `${this.config.dirs.modules}/${moduleConfig.npmPackage}`
				: moduleConfig.npmPackage;
			const module = ModuleFactory.create(
				moduleConfig.loadAs,
				npmPackage,
				moduleConfig.options,
				logger,
				this.bus,
			);
			this.modules[module.alias] = module;
		});

		return Promise.each(Object.keys(this.modules), m => this.modules[m].load());
	}

	async unloadModules(modules = null) {
		return Promise.mapSeries(modules || Object.keys(this.modules), async (m) => {
			await this.modules[m].unload();
			delete this.modules[m];
		});
	}

	async start(options = {}) {
		await this.init(options);

		logger.info('Starting lisk...');
		await this.setup();

		process.on('uncaughtException', (err) => {
			// Handle error safely
			logger.fatal('System error', { message: err.message, stack: err.stack });
			this.stop(err, 1);
		});

		process.on('unhandledRejection', (err) => {
			// Handle error safely
			logger.fatal('System error', { message: err.message, stack: err.stack });
			this.stop(err, 1);
		});

		process.once('SIGTERM', () => this.stop());

		process.once('SIGINT', () => this.stop());

		await this.load();
	}

	stop(reason, code = 0) {
		logger.info('Stopping controller...');

		if (reason) {
			logger.error(reason);
		}

		this.bus.rpcSocket.close();

		this.unloadModules()
			.then(() => {
				logger.info('Unload completed');

				fs.emptyDirSync(config.dirs.temp);
				process.exit(code);
			})
			.catch((error) => {
				logger.error('Caused error during upload', error);
				process.exit(1);
			});
	}
}

module.exports = Controller;
