## Modules

Modules are individual building blocks for the lisk. The implementation of each module is up-to user but by default it should generate an object with this structure.

```js
// Exported as main file to javascript package
export default {
	/**
	 * A unique module name accessed through out the system.
	 * If some module already registered with same alias, it will throw error
	 */
	alias: 'moduleName',

	/**
	 * Package detail referring the version and other details
	 * Easiest way is to directly refer to package.json for all details
	 */

	pkg: require('../package.json'),

	/**
	 * Supported configurations for the module with default values
	 */

	defaults: {},

	/**
	 * List of valid events which this module want to register with the controller
	 * Each event name will be prefixed by module alias, e.g. moduleName:event1
	 * Listing event means to register a valid event in the eco-system
	 * Any module can subscribe or publish that event in the eco-system
	 */

	events: [],

	/**
	 * List of valid actions which this module want to register with the controller
	 * Each action name will be prefixed by module alias, e.g. moduleName:action1
	 * Action definition can be provided on module load with the help of the channels
	 * Source module can define the action while others can invoke that action
	 */

	actions: [],

	/**
	 * Method which will be invoked by controller to load the module
	 * make sure all loading logic get completed during the life cycle of load.
	 * Controller emit an event `lisk:ready` which you can use to perform
	 * some activities which you want to perform when every other module is loaded
	 *
	 * @param {Channel} channel - An interface to channel
	 * @param {Object} options - An object of module options
	 * @return {Promise<void>}
	 */
	load: async (channel, options) => {},

	/**
	 * Method to be invoked by controller to perform the cleanup
	 *
	 * @return {Promise<void>}
	 */
	unload: async () => {},
};
```

### Module Life Cycle

Module life cycle consists of following events in the right order:

**Loading**

* _module_:registeredToBus
* _module_:loading:started
* _module_:loading:finished

**Unloading**

* _module_:unloading:started
* _module_:unloading:finished

### Channels

Every module `load` method that you export accepts two arguments. e.g. `load: async (channel, options) => {},`. The second argument is simply the JSON object for the options provided in the config file.

Second param `channel` is an instance of a channel class depending upon the type of module. It either can be an

1. [EventEmitterChannel](../packages/lisk-core/src/channels/event_emitter.js)
2. [ChildProcessChannel](../packages/lisk-core/src/channels/child_process.js)

depending upon the type [loadAs](../packages/lisk-core/src/schema/config.js#L66) config option for that module.

What ever implementation you received in your module, it must expose with one consistent interface, specially these four methods.

#### subscribe

Subscribe to any event occurring on the main bus.

```js
channel.subsribe('lisk:ready', event => {});
```

It accepts two arguments, first one is the event name with specific module. Second argument is a callback which accepts one argument, which will be an instance of an [event object](#event).

#### publish

Its used to publish event on the bus, which will be delivered to all subscribers.

```js
channel.publish('chain:newTransaction', transactionObject);
```

It accepts two arguments, first one is the event name with specific module. Second argument is the data object passed through the event.

#### action

Define an action to for your module, which later can be invoked by other modules.

```js
channel.action('verifyTransaction', async action => {});
```

It accepts two arguments, first one is the action name without a module name, current module will always be prefixed. You can't define action for some other module inside your module. Second argument is a callback which accepts one argument, which will be an instance of an [action object](#action).

#### invoke

Its used to invoke an action for some module.

```js
result = await channel.invoke('chain:verifyTransaction', transactionObject);
```

It accepts two arguments, first one is the event name with specific module. Second argument is the data object passed through the action.

### Event

Event object is a unified interface for all event communication between modules.

| Property | Type   | Description                                              |
| -------- | ------ | -------------------------------------------------------- |
| name     | string | Name of the event which is triggered on the bus          |
| module   | string | The name of target module for which event was triggered. |
| source   | string | The name of source module which published that event.    |
| data     | mixed  | The data which was send while publishing the event.      |

You can find details of the [event](../packages/lisk-core/src/event.js)

### Action

Action object is a unified interface for all action based communication between modules.

| Property | Type   | Description                                                      |
| -------- | ------ | ---------------------------------------------------------------- |
| name     | string | Name of the event which is triggered on the bus                  |
| module   | string | The name of target module for which event was triggered.         |
| source   | string | The name of source module which invoked that event.              |
| params   | mixed  | The data which was associated with the invocation for the action |

You can find details of the [action](../packages/lisk-core/src/action.js)
