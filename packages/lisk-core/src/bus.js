'use strict';

const EventEmitter2 = require('eventemitter2').EventEmitter2;
const axon = require('axon');

module.exports = class Bus extends EventEmitter2 {
	constructor(controller, options) {
		super(options);
		this.controller = controller;

		// Hash map used instead of arrays for performance.
		this.actions = {};
		this.events = {};

		// Sockets for IPC actions
		this.rpcSocket = axon.socket('rep');
		this.rpcSocket.bind(6001);

		this.rpcSocket.on('registerEvents', (events, reply) => {
			this.registerEvents(events).then((data) => {
				reply(data);
			});
		});

		this.rpcSocket.on('registerActions', (events, reply) => {
			this.registerActions(events).then((data) => {
				reply(data);
			});
		})
	}

	async registerEvents(events){
		events.map(e => {
			if(this.events[e]) {
				throw `Event "${e}" already registered with bus.`;
			}
			this.events[e] = true;
		});
	}

	async registerActions(actions){
		actions.map(a => {
			if(this.actions[a]) {
				throw `Action "${a}" already registered with bus.`;
			}
			this.actions[a] = true;
		});
	}

	async invoke(actionName, params, cb) {
		if(this.actions[actionName]) {
			const moduleAlias = actionName.split(':').shift();
			return await this.controller.getModule(moduleAlias).invoke(actionName, params, cb);
		}
	}

	getActions() {
		return Object.keys(this.actions);
	}

	getEvents() {
		return Object.keys(this.events);
	}
};
