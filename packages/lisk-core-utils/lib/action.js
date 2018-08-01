'use strict';

module.exports = class Action {
	/**
	 *
	 * @param name - Can be simple event or be combination of module:event
	 * @param {array} params - Params associated with the action
	 * @param moduleName - Module name if event name does not have its prefix
	 */
	constructor(name, params=[], moduleName=null){
		name = name.split(':');
		this.name = name.pop();
		this.params = params;
		this.module = name[0] || moduleName;

		if(!this.module) {
			throw `Can't create an action ${this.name} without a module specified.`;
		}

		this.isValidActionName(this.name);
	}

	toJSON() {
		return {name: this.name, module: this.module, params: this.params};
	}

	toString() {
		return `${this.module}:${this.name}`
	}

	isValidActionName(name, throwError = true) {
		const result = (/^[A-Za-z0-9:]+$/.test(name));
		if (throwError && !result) {
			throw `[${this.module}] Invalid action name ${name}.`
		}
		return result;
	}
};
