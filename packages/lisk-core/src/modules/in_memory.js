const EventEmitterChannel = require('../channels/event_emitter');
const BaseModule = require('./base');

module.exports = class InMemoryModule extends BaseModule {
	constructor(npmPackageName, options = {}, logger, bus) {
		super(npmPackageName, options, logger);
		this.type = 'in_memory';
		this.bus = bus;
	}

	async load() {
		this.logger.info(
			`Loading module with alias: ${this.alias}(${this.version})`,
		);
		this.channel = new EventEmitterChannel(
			this.alias,
			this.events,
			this.actions,
			this.bus,
			{},
		);

		await this.channel.registerToBus();
		this.channel.publish(`${this.alias}:registeredToBus`);

		this.channel.publish(`${this.alias}:loading:started`);
		await this.getPackageSpecs().load(this.channel, this.options);
		this.channel.publish(`${this.alias}:loading:finished`);

		this.logger.info(`Ready module with alias: ${this.alias}(${this.version})`);
	}

	async unload() {
		this.channel.publish(`${this.alias}:unloading:started`);
		await this.getPackageSpecs().unload();
		this.channel.publish(`${this.alias}:unloading:finished`);
	}

	async invoke(action) {
		return this.channel.invoke(action);
	}
};
