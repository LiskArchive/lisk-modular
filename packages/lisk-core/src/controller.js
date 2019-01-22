const Promise = require('bluebird');
const fs = require('fs-extra');
const config = require('./helpers/config');
const ModuleFactory = require('./factories/modules');
const ComponentFactory = require('./factories/components');
const EventEmitterChannel = require('./channels/event_emitter');
const Schema = require('./helpers/schema');
const Bus = require('./bus');

const logger = ComponentFactory.create('logger', config.components.logger);

module.exports = class Controller {
	constructor(options) {
		logger.info('Initializing controller');
		this.config = options;
		this.modules = {};
		this.channel = null;

		// Setting up bus
		if (!this.bus) {
			this.bus = new Bus(this, {
				wildcard: true,
				delimiter: ':',
				maxListeners: 1000,
			});
		}
	}

	async setup() {
		await Schema.setup();

		const errors = Schema.validate(this.config, Schema.getSchema().config);
		if (errors.length) {
			logger.error(errors);
			throw new Error('Configuration Validation Failed');
		}

		process.title = `Lisk ${this.config.version} : (${
			this.config.dirs.root
		})`;

		// Make sure all directories exists
		fs.emptyDirSync(this.config.dirs.temp);
		Object.keys(this.config.dirs).forEach(dir =>
			fs.ensureDirSync(this.config.dirs[dir]),
		);
		fs.writeFileSync(`${this.config.dirs.pids}/controller.pid`, process.pid);

		// Set the custom directory to load modules
		if (this.config.dirs.modules) {
			logger.info(
				`Setting custom module directory to: ${this.config.dirs.modules}`,
			);
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
		this.config.modules.forEach(moduleConfig => {
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
		return Promise.mapSeries(modules || Object.keys(this.modules), async m => {
			await this.modules[m].unload();
			delete this.modules[m];
		});
	}

	static async start(options = {}) {
		logger.info('Starting lisk...');
		const ctrl = new Controller(Object.assign({}, config, options));
		await ctrl.setup();

		process.on('uncaughtException', err => {
			// Handle error safely
			logger.fatal('System error', { message: err.message, stack: err.stack });
			ctrl.stop(err, 1);
		});

		process.on('unhandledRejection', err => {
			// Handle error safely
			logger.fatal('System error', { message: err.message, stack: err.stack });
			ctrl.stop(err, 1);
		});

		process.once('SIGTERM', () => ctrl.stop());

		process.once('SIGINT', () => ctrl.stop());

		await ctrl.load();
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
			.catch(error => {
				logger.error('Caused error during upload', error);
				process.exit(1);
			});
	}
};
