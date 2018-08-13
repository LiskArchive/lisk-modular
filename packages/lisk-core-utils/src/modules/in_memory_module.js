const EventEmitterChannel = require('../channels/event_emitter');
const BaseModule = require('./base');

module.exports = class InMemoryModule extends BaseModule {
	constructor(moduleName, options = {}, logger, bus) {
		super(moduleName, options, logger);
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
		await this.getPackageSpecs().load(this.channel, this.options);
		this.logger.info(`Ready module with alias: ${this.alias}(${this.version})`);
	}

	async unload() {
		await this.getPackageSpecs().unload();
	}

	async invoke(action) {
		return this.channel.invoke(action);
	}
};
