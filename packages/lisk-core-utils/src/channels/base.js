'use strict';

const AsyncFunction = (async () => {}).constructor;

module.exports = class Base {
	constructor(module, options = {}){
		this.module = module;
		this.options = options;

		this.events = this.module.events.map(e => {
			const eventName = `${this.module.alias}:${e}`;
			if(!this.isValidEventName(eventName)){
				throw `Invalid event name "${eventName}"`;
			}
			return eventName;
		});

		this.actions = this.module.actions.map(a => {
			const actionName = `${this.module.alias}:${a}`;
			if(!this.isValidActionName(actionName)){
				throw `Invalid action name "${actionName}"`;
			}
			return actionName;
		});
	}

	async registerToBus() {
		throw new TypeError('This method must be implemented in child classes. ');
	}

	// Listen to any event happening in the application
	// Specified as moduleName:eventName
	// If its related to your own module specify as :eventName
	subscribe(eventName, cb) {
		if(!this.isValidEventName(eventName)){
			throw `Invalid event name ${eventName}`
		}
		// cb should be invoked form child class
	}

	// Publish the event on the channel
	// Specified as moduleName:eventName
	// If its related to your own module specify as :eventName
	publish(eventName, data) {
		if(!this.isValidEventName(eventName)){
			throw `Invalid event name ${eventName}`
		}
		// further implementation should be done in child class
	}

	// Register action available to your module
	action(actionName, cb) {
		if(!this.isValidActionName(actionName)){
			throw `Invalid action name ${actionName}`
		}

		// Check action is in spec
		if(!this.actions.includes(actionName)) {
			throw `Invalid action name ${actionName}. Its not specified in module spec.`
		}

		// Check action callback is an async function
		if(!(cb instanceof AsyncFunction === true)){
			throw `Action ${actionName} callback must be async function.`
		}
		// cb should be invoked form child class
	}

	// Call action of any module through controller
	// Specified as moduleName:actionName
	async invoke(actionName, params) {
		if(!this.isValidActionName(actionName)){
			throw `Invalid action name ${actionName}`
		}
		// further implementation should be done in child class
	}

	isValidEventName(name) {
		return (/[A-Za-z0-9]+:[A-Za-z0-9]+/.test(name));
	}

	isValidActionName(name) {
		return (/[A-Za-z0-9]+:[A-Za-z0-9]+/.test(name));
	}

};