const packageSpecs = new WeakMap();

module.exports = class Base {
	/**
	 * Represent an abstract module of lisk ecosystem
	 * @param {String} moduleName
	 * @param {object} options
	 * @param {loadAsProcess} options.loadAsProcess
	 */
	constructor(moduleName, options, logger) {
		logger.info(`Bootstrapping module ${moduleName}`);

		// eslint-disable-next-line  import/no-dynamic-require, global-require
		const pkg = require(`../../../../modules/${moduleName}`);

		this.name = moduleName;
		this.alias = pkg.alias;
		this.version = pkg.pkg.version;
		this.events = pkg.events;
		this.actions = pkg.actions;
		this.pkg = pkg.pkg;
		this.options = options;
		this.logger = logger;

		packageSpecs.set(this, pkg);
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

	getPackageSpecs() {
		return packageSpecs.get(this);
	}
};
