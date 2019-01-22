const Event = require('../event');
const Action = require('../action');

const internalEvents = [
	'registeredToBus',
	'loading:started',
	'loading:finished',
];

module.exports = class Base {
	constructor(moduleAlias, events, actions, options = {}) {
		this.moduleAlias = moduleAlias;
		this.options = options;
		this.eventsList = [];
		this.actionsList = [];

		events.forEach((event) =>
			this.eventList.push(new Event(`${moduleAlias}:${event}`, null, null)),
		);

		if (!options.skipInternalEvents) {
			internalEvents.forEach((event) =>
				this.eventList.push(new Event(`${moduleAlias}:${event}`, null, null)),
			);
		}

		actions.forEach((action) =>
			this.actionsList.push(new Action(`${moduleAlias}:${action}`, null, null)),
		);
	}

	getActions() {
		return this.actionsList;
	}

	getEvents() {
		return this.eventsList;
	}

	// eslint-disable-next-line class-methods-use-this
	async registerToBus() {
		throw new TypeError('This method must be implemented in child classes. ');
	}

	// Listen to any event happening in the application
	// Specified as moduleName:eventName
	// If its related to your own moduleAlias specify as :eventName
	// eslint-disable-next-line no-unused-vars, class-methods-use-this
	subscribe(eventName, cb) {
		throw new TypeError('This method must be implemented in child classes. ');
	}

	// Publish the event on the channel
	// Specified as moduleName:eventName
	// If its related to your own moduleAlias specify as :eventName
	// eslint-disable-next-line no-unused-vars, class-methods-use-this
	publish(eventName, data) {
		throw new TypeError('This method must be implemented in child classes. ');
	}

	// Register action available to your moduleAlias
	// eslint-disable-next-line no-unused-vars, class-methods-use-this
	action(actionName, cb) {
		throw new TypeError('This method must be implemented in child classes. ');
	}

	// Call action of any moduleAlias through controller
	// Specified as moduleName:actionName
	// eslint-disable-next-line no-unused-vars, class-methods-use-this
	async invoke(actionName, params) {
		throw new TypeError('This method must be implemented in child classes. ');
	}

	isValidEventName(name, throwError = true) {
		const result = /[A-Za-z0-9]+:[A-Za-z0-9]+/.test(name);
		if (throwError && !result) {
			throw new Error(
				`[${this.moduleAlias.alias}] Invalid event name ${name}.`,
			);
		}
		return result;
	}

	isValidActionName(name, throwError = true) {
		const result = /[A-Za-z0-9]+:[A-Za-z0-9]+/.test(name);
		if (throwError && !result) {
			throw new Error(
				`[${this.moduleAlias.alias}] Invalid action name ${name}.`,
			);
		}
		return result;
	}
};
