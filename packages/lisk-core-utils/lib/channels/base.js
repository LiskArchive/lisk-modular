'use strict';

const AsyncFunction = (async () => {
}).constructor;
const eventsList = new WeakMap();
const actionsList = new WeakMap();

module.exports = class Base {
	constructor(moduleAlias, events, actions, options = {}) {
		this.moduleAlias = moduleAlias;
		this.options = options;

		eventsList.set(this, events.map(e => {
			const eventName = `${this.moduleAlias}:${e}`;
			if (!this.isValidEventName(eventName)) {
				throw `Invalid event name "${eventName}"`;
			}
			return eventName;
		}));

		actionsList.set(this, actions.map(a => {
			const actionName = `${this.moduleAlias}:${a}`;
			if (!this.isValidActionName(actionName)) {
				throw `Invalid action name "${actionName}"`;
			}
			return actionName;
		}));
	}

	getActions() {
		return actionsList.get(this);
	}

	getEvents() {
		return eventsList.get(this);
	}

	async registerToBus() {
		throw new TypeError('This method must be implemented in child classes. ');
	}

	// Listen to any event happening in the application
	// Specified as moduleName:eventName
	// If its related to your own moduleAlias specify as :eventName
	subscribe(eventName, cb) {
		throw new TypeError('This method must be implemented in child classes. ');
	}

	// Publish the event on the channel
	// Specified as moduleName:eventName
	// If its related to your own moduleAlias specify as :eventName
	publish(eventName, data) {
		throw new TypeError('This method must be implemented in child classes. ');
	}

	// Register action available to your moduleAlias
	action(actionName, cb) {
		throw new TypeError('This method must be implemented in child classes. ');
	}

	// Call action of any moduleAlias through controller
	// Specified as moduleName:actionName
	async invoke(actionName, params) {
		throw new TypeError('This method must be implemented in child classes. ');
	}

	isValidEventName(name, throwError = true) {
		const result = (/[A-Za-z0-9]+:[A-Za-z0-9]+/.test(name));
		if (throwError && !result) {
			throw `[${this.moduleAlias.alias}] Invalid event name ${name}.`
		}
		return result;
	}

	isValidActionName(name, throwError = true) {
		const result = (/[A-Za-z0-9]+:[A-Za-z0-9]+/.test(name));
		if (throwError && !result) {
			throw `[${this.moduleAlias.alias}] Invalid action name ${name}.`
		}
		return result;
	}

	isValidActionParams(actionName, cb, throwError = true) {

		let result = this.getActions().includes(actionName);

		// Check action is in spec
		if (throwError && !result) {
			throw `[${this.moduleAlias.alias}] Invalid action name ${actionName}. Its not specified in module spec.`
		}

		// Check action callback is an async function
		result = (cb instanceof AsyncFunction === true);
		if (throwError && !result) {
			throw `[${this.moduleAlias.alias}] Action ${actionName} callback must be async function.`
		}

		return result;
	}

};
