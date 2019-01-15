const Bus = require('./lib/Bus');

const bus = new Bus({}, {
	wildcard: true,
	delimiter: ':',
	maxListeners: 1000,
});

module.exports = bus;
