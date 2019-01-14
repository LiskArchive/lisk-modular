const app = require('commander');
const start = require('./actions/start');

app
	.command('start')
	.action(async (program, options = {}) => start(options));

module.exports = app;
