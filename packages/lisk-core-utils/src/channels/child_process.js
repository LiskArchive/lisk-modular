const homeDir = require('os').homedir();
const axon = require('axon');
const rpc = require('axon-rpc');
const Promise = require('bluebird');
const Event = require('../event');
const Action = require('../action');
const BaseChannel = require('./base');

module.exports = class ChildProcessChannel extends BaseChannel {
	constructor(moduleAlias, events, actions, options = {}) {
		super(moduleAlias, events, actions, options);

		const busRpcSocket = axon.socket('req');
		const busRpcSockePath = `unix://${homeDir}/.lisk-core/sockets/bus_rpc.sock`;
		this.busRpcClient = new rpc.Client(busRpcSocket);
		busRpcSocket.connect(busRpcSockePath);

		const rpcSocketPath = `${homeDir}/.lisk-core/sockets/${
			this.moduleAlias
		}_rpc.sock`;
		const rpcSocket = axon.socket('rep');
		this.rpcServer = new rpc.Server(rpcSocket);
		rpcSocket.bind(`unix://${rpcSocketPath}`);

		this.rpcServer.expose('invoke', (actionName, params, cb) => {
			this.invoke(actionName, params)
				.then(result => setImmediate(cb, null, result))
				.catch(error => setImmediate(cb, error));
		});

		this.actionMap = {};
		this.eventsMap = {};
	}

	async registerToBus() {
		return new Promise((resolve, reject) => {
			this.busRpcClient.call(
				'registerChannel',
				this.moduleAlias,
				this.getEvents().map(e => e.name),
				this.getActions().map(a => a.name),
				{},
				(err, result) => {
					if (err) return reject(err);

					// Register the event hook
					process.on('message', data =>
						setImmediate(this.eventsMap[data.eventName], data.eventData),
					);

					return resolve(result);
				},
			);
		});
	}

	subscribe(eventName, cb) {
		this.eventsMap[(new Event(eventName)).key()] = (data) => {
			return setImmediate(cb, Event.deserialize(data));
		};
	}

	publish(eventName, data) {
		const event = new Event(eventName, data, this.moduleAlias);

		process.send(event.serialize());
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
		return new Promise((resolve, reject) => {
			this.busRpcClient.call(
				'invoke',
				action.module,
				action.name,
				params,
				(err, data) => {
					if (err) {
						return setImmediate(reject, err);
					}

					return setImmediate(resolve, data);
				},
			);
		});
	}
};
