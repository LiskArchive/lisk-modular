'use strict';

const BaseChannel = require('./base');
const _ = require('lodash');

module.exports = class EventEmitterChannel extends BaseChannel {
	constructor(moduleAlias, events, actions, bus, options = {}) {
		super(moduleAlias, events, actions, options);
		this.bus = bus;
		this.actionMap = {};
	}

	async registerToBus() {
		await this.bus.registerEvents(this.getEvents());
		await this.bus.registerActions(this.getActions());
	}

	subscribe(eventName, cb) {
		this.isValidEventName(eventName);

		this.bus.on(eventName, cb);
	}

	publish(eventName, data) {
		this.isValidEventName(eventName);

		this.bus.emit(eventName, data);
	}

	action(actionName, cb) {
		actionName = `${this.moduleAlias}:${actionName}`;
		this.isValidActionName(actionName);

		this.actionMap[actionName] = cb;
	}

	async invoke(actionName, params) {
		this.isValidActionName(actionName);

		if (this.actionMap[actionName]) {
			return await this.actionMap[actionName](params);
		}

		return (await this.bus.invoke(actionName, params));
	}
};
