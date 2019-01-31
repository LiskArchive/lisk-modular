const start = require('./actions/start');

const app = require('commander');

app
	.command('start')
	.action(async (program, options = {}) => start(options));

module.exports = app;
