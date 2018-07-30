'use strict';

const BaseChannel = require('./base');
const _ = require('lodash');
const axon = require('axon');
const Promise = require('bluebird');

module.exports = class ChildProcessChannel extends BaseChannel {
	constructor(module, options={}){
		super(module, options);

		this.actionMap = {};
		this.eventsMap = {};
	}

	async registerToBus() {
		process.on('message', (data) => {
			console.log(this.eventsMap[data.eventName], data.eventName, data.eventData);
			return setImmediate(this.eventsMap[data.eventName], data.eventData);
		});
	}

	subscribe(eventName, cb) {
		this.isValidEventName(eventName);
		console.log(eventName, this.eventsMap);
		this.eventsMap[eventName] = cb;
	}

	publish(eventName, data) {
		this.isValidEventName(eventName);
		process.send({eventName: eventName, eventData: data});
	}

	action(actionName, cb) {
		actionName = `${this.module.alias}:${actionName}`;
		this.isValidActionName(actionName);

		this.actionMap[actionName] = cb;
	}

	async invoke(actionName, params) {
		console.log(`[channel] [invoke] [${actionName}] ${this.module.alias} `);
		this.isValidActionName(actionName);

		if(this.actionMap[actionName]) {
			return this.actionMap[actionName](params);
		} else {
			return new Promise((resolve, reject) => {
				// try {
				// 	this.rpcSocket.send(actionName, params, (response) => {
				// 		resolve(response);
				// 	});
				// } catch (error) {
				// 	reject(error);
				// }
				resolve();
			});
		}
	}
};
