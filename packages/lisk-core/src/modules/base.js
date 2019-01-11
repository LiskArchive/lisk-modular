module.exports = class Base {
	/**
	 * Represent an abstract module of lisk ecosystem
	 * @param {String} npmPackageName
	 * @param {object} options
	 * @param {loadAsProcess} options.loadAsProcess
	 */
	constructor(npmPackageName, options, logger) {
		logger.info(`Bootstrapping module ${npmPackageName}`);

		/* eslint-disable import/no-dynamic-require, global-require */
		const {
			alias, version, events, actions,
		} = require(npmPackageName);
		/* eslint-enable import/no-dynamic-require, global-require */

		this.packgeName = npmPackageName;
		this.alias = alias;
		this.version = version;
		this.events = events;
		this.actions = actions;
		this.options = options;
		this.logger = logger;
	}

	// eslint-disable-next-line class-methods-use-this
	establishChannel() {
		throw new TypeError('Implement this method in child class.');
	}

	// eslint-disable-next-line class-methods-use-this
	async load() {
		throw new TypeError('Implement this method in child class.');
	}

	// eslint-disable-next-line no-unused-vars, class-methods-use-this
	async unload(channel, options) {
		throw new TypeError('Implement this method in child class.');
	}
};
