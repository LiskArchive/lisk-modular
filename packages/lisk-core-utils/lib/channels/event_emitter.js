'use strict';

const BaseChannel = require('./base');
const _ = require('lodash');
const Event = require('../event');
const Action = require('../action');

module.exports = class EventEmitterChannel extends BaseChannel {
	constructor(moduleAlias, events, actions, bus, options = {}) {
		super(moduleAlias, events, actions, options);
		this.bus = bus;
		this.actionMap = {};
	}

	async registerToBus() {
		await this.bus.registerChannel(
			this.moduleAlias,
			this.getEvents().map(e => e.name),
			this.getActions().map(a => a.name), {});
	}

	subscribe(eventName, cb) {
		const event = new Event(eventName);

		this.bus.on(event.toEmitterName(), cb);
	}

	publish(eventName, data) {
		const event = new Event(eventName, data);

		this.bus.emit(event.toEmitterName(), event.data);
	}

	action(actionName, cb) {
		const action = new Action(actionName, null, this.moduleAlias);
		this.actionMap[action.name] = cb;
	}

	async invoke(actionName, params) {
		const action = new Action(actionName, params, this.moduleAlias);

		if (action.module === this.moduleAlias) {
			return await this.actionMap[action.name](action.params);
		}

		return (await this.bus.invoke(action.module, action.name, params));
	}
};
