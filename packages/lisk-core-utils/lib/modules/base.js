'use strict';

let packageInfo = new WeakMap();

module.exports = class Base {
	/**
	 * Represent an abstract module of lisk ecosystem
	 * @param {String} moduleName
	 * @param {object} options
	 * @param {loadAsProcess} options.loadAsProcess
	 */
	constructor(moduleName, options) {
		console.log(`Bootstrapping module ${moduleName}`);
		const pkg = this.loadModulePackage(moduleName);
		this.name = moduleName;
		this.alias = pkg.alias;
		this.version = pkg.pkg.version;
		this.events = pkg.events;
		this.actions = pkg.actions;
		this.pkg = pkg.pkg;
		this.options = options;

		// Setup channel in child constructors
		this.channel = null;

		packageInfo.set(this, pkg);
	}

	establishChannel(){
		throw 'Implement this method in child class.'
	}

	loadModulePackage(name) {
		return require(`../../../../modules/${name}`);
	}

	async load() {
		await packageInfo.get(this).load(this.channel, this.options);
	}

	async unload(channel, options) {
		await packageInfo.get(this).unload(channel, options);
	}
};
