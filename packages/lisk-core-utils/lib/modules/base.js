'use strict';

const packageSpecs = new WeakMap();

const loadModulePackage = name => require(`../../../../modules/${name}`);

module.exports = class Base {
	/**
	 * Represent an abstract module of lisk ecosystem
	 * @param {String} moduleName
	 * @param {object} options
	 * @param {loadAsProcess} options.loadAsProcess
	 */
	constructor(moduleName, options) {
		console.log(`Bootstrapping module ${moduleName}`);
		const pkg = loadModulePackage(moduleName);
		this.name = moduleName;
		this.alias = pkg.alias;
		this.version = pkg.pkg.version;
		this.events = pkg.events;
		this.actions = pkg.actions;
		this.pkg = pkg.pkg;
		this.options = options;

		packageSpecs.set(this, pkg);
	}

	establishChannel(){
		throw new TypeError('Implement this method in child class.');
	}

	async load() {
		throw new TypeError('Implement this method in child class.');
	}

	async unload(channel, options) {
		throw new TypeError('Implement this method in child class.');
	}

	getPackageSpecs() {
		return packageSpecs.get(this);
	}
};
