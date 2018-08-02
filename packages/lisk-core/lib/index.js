#!/usr/bin/env node

const app = require('commander');

app
	.command('start')
	.description('star the application')
	.action(async (options) => require('./actions/start')(options));