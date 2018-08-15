const path = require('path');
const homeDir = require('os').homedir();
const axon = require('axon');
const rpc = require('axon-rpc');
const fs = require('fs-extra');
const { EventEmitter2 } = require('eventemitter2');
const Action = require('./action');

module.exports = class Bus extends EventEmitter2 {
	constructor(controller, options) {
		super(options);
		this.controller = controller;

		// Hash map used instead of arrays for performance.
		this.actions = {};
		this.events = {};

		// Sockets for IPC actions
		const rpcSocketPath = `${homeDir}/.lisk-core/sockets/bus_rpc.sock`;
		fs.ensureDirSync(path.dirname(rpcSocketPath));
		const rpcSocket = axon.socket('rep');
		this.rpcServer = new rpc.Server(rpcSocket);
		rpcSocket.bind(`unix://${rpcSocketPath}`);

		this.rpcServer.expose(
			'registerChannel',
			(moduleAlias, events, actions, moduleOptions, cb) => {
				this.registerChannel(moduleAlias, events, actions, moduleOptions)
					.then(() => setImmediate(cb, null))
					.catch(error => setImmediate(cb, error));
			},
		);

		this.rpcServer.expose('invoke', (action, cb) => {
			this.invoke(action)
				.then(data => setImmediate(cb, null, data))
				.catch(error => setImmediate(cb, error));
		});
	}

	// eslint-disable-next-line no-unused-vars
	async registerChannel(moduleAlias, events, actions, options) {
		events.forEach(e => {
			const eventName = `${moduleAlias}:${e}`;
			if (this.events[eventName]) {
				throw new Error(`Event "${eventName}" already registered with bus.`);
			}
			this.events[eventName] = true;
		});

		actions.forEach(a => {
			const actionName = `${moduleAlias}:${a}`;
			if (this.actions[actionName]) {
				throw new Error(`Action "${actionName}" already registered with bus.`);
			}
			this.actions[actionName] = true;
		});
	}

	invoke(actionData) {
		const action = Action.deserialize(actionData);

		if (action.module === 'lisk') {
			return this.controller.channel.invoke(action);
		}

		if (this.actions[action.key()]) {
			return this.controller.getModule(action.module).invoke(action);
		}

		throw new Error(`Action ${action.key()} is not registered to bus.`);
	}

	getActions() {
		return Object.keys(this.actions);
	}

	getEvents() {
		return Object.keys(this.events);
	}
};
