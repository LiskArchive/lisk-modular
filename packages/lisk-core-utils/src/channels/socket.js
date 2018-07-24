'use strict';

const BaseChannel = require('./base');
const _ = require('lodash');
const axon = require('axon');
const Promise = require('bluebird');

module.exports = class SocketChannel extends BaseChannel {
	constructor(module, options={}){
		super(module, options);

		this.eventSocket = axon.socket('sub');
		this.eventSocket.connect(6000);

		this.rpcSocket = axon.socket('req');
		this.rpcSocket.connect(6001);

		this.eventTopicCbs = {};

		this.eventSocket.on('message', (topic, message) => {
			this.eventTopicCbs[topic].call(this, message);
		});

		this.actionMap = {};
	}
	async registerToBus() {
		return new Promise((resolve, reject) => {
			try {
				this.rpcSocket.send('registerEvents', this.events, (registerEventsResponse) => {
					this.rpcSocket.send('registerActions', this.actions, (registerActionsResponse) => {
						resolve(true)
					});
				})
			} catch (err) {
				reject(err);
			}
		});
	}

	subscribe(eventName, cb) {
		super.subscribe(eventName);
		this.eventTopicCbs[eventName] = cb;
		this.eventSocket.subscribe(eventName);
	}

	publish(eventName, data) {
		super.publish(eventName);
		this.eventSocket.sent(eventName, data);
	}

	action(actionName, cb) {
		actionName = `${this.module.alias}:${actionName}`;
		super.action(actionName, cb);
		this.actionMap[actionName] = cb;
	}

	async invoke(actionName, params) {
		console.log(`[channel] [invoke] [${actionName}] ${this.module.alias} `);
		await super.invoke(actionName);

		if(this.actionMap[actionName]) {
			return await this.actionMap[actionName](params);
		} else {
			return new Promise((resolve, reject) => {
				try {
					this.rpcSocket.send(actionName, params, (response) => {
						resolve(response);
					});
				} catch (error) {
					reject(error);
				}
			});
		}
	}
};
