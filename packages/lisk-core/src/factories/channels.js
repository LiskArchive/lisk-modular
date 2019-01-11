const channelTypes = {};

const ChannelFactory = {
	register: (channelType, channelClass) => {
		if (channelTypes[channelType]) {
			throw new TypeError(`Channel type "${channelType}" already registered.`);
		}
		channelTypes[channelType] = channelClass;
	},

	create: (channelType, module, options = {}) => {
		if (!channelTypes[channelType]) {
			throw new TypeError(`Channel type "${channelType}" not registered.`);
		}
		return new channelTypes[channelType](module, options);
	},
};

ChannelFactory.register('event_emitter', require('../channels/EventEmitterChannel'));
ChannelFactory.register('socket', require('../channels/ChildProcessChannel'));

module.exports = ChannelFactory;
