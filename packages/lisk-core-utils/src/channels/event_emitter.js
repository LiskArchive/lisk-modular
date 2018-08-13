const Event = require('../event');
const Action = require('../action');
const BaseChannel = require('./base');

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
			this.getActions().map(a => a.name),
			{},
		);
	}

	subscribe(eventName, cb) {
		this.bus.on((new Event(eventName)).toEmitterKey(), (data) => {
			return setImmediate(cb, Event.deserialize(data));
		});
	}

	publish(eventName, data) {
		const event = new Event(eventName, data, this.moduleAlias);

		this.bus.emit(event.toEmitterKey(), event.serialize());
	}

	action(actionName, cb) {
		const action = new Action(actionName, null, this.moduleAlias);
		this.actionMap[action.name] = cb;
	}

	async invoke(actionName, params) {
		const action = new Action(actionName, params, this.moduleAlias);

		if (action.module === this.moduleAlias) {
			return this.actionMap[action.name](action.params);
		}

		return this.bus.invoke(action.module, action.name, params);
	}
};
