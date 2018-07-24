'use strict';

const BaseChannel = require('./base');
const _ = require('lodash');

module.exports = class EventEmitterChannel extends BaseChannel {
	constructor(module, bus, options={}){
		super(module, options);
		this.bus = bus;
		this.actionMap = {};
	}
	async registerToBus() {
		await this.bus.registerEvents(this.events);
		await this.bus.registerActions(this.actions);
	}

	subscribe(eventName, cb) {
		super.subscribe(eventName);
		this.bus.on(eventName, cb);
	}

	publish(eventName, data) {
		super.publish(eventName);
		this.bus.emit(eventName, data);
	}

	action(actionName, cb) {
		actionName = `${this.module.alias}:${actionName}`;
		super.action(actionName, cb);
		this.actionMap[actionName] = cb;
	}

	async invoke(actionName, params) {
		await super.invoke(actionName);

		if(this.actionMap[actionName]) {
			return await this.actionMap[actionName](params);
		} else {
			return(await this.bus.invoke(actionName, params));
		}
	}
};
