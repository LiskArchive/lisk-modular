const Event = require('../event');
const Action = require('../action');

const internalEvents = [
	'registeredToBus',
	'loading:started',
	'loading:finished',
];

/**
 * Private object is used to store private variables of the instances.
 * Since variables will be stored with the instance reference (this),
 * this approach is an acceptable way to store private variables
 * and easy to refactor in future.
 *
 * See: http://voidcanvas.com/es6-private-variables/
 */
const private = {
	eventList: new WeakMap(),
	actionList: new WeakMap(),
}

module.exports = class Base {
	constructor(moduleAlias, events, actions, options = {}) {
		this.moduleAlias = moduleAlias;
		this.options = options;

		const eventList = [];
		const actionList = [];

		events.forEach((event) =>
			eventList.push(new Event(`${moduleAlias}:${event}`, null, null)),
		);

		if (!options.skipInternalEvents) {
			internalEvents.forEach((event) =>
				eventList.push(new Event(`${moduleAlias}:${event}`, null, null)),
			);
		}

		actions.forEach((action) =>
			actionList.push(new Action(`${moduleAlias}:${action}`, null, null)),
		);

		private.eventList.set(this, Object.freeze(eventList));
		private.actionList.set(this, Object.freeze(actionList));
	}

	getActions() {
		return private.actionList.get(this);
	}

	getEvents() {
		return private.eventList.get(this);
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
