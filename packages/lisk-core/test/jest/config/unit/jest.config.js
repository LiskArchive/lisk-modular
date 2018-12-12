const base = require('../jest.config.base');

module.exports = {
	...base,
	testMatch: ['<rootDir>/test/**/*.(spec|test).js'],
};
