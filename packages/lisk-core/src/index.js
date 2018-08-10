#!/usr/bin/env node

const app = require('commander');
const CLI = require('./cli');

app
	.command('start')
	.description('star the application')
	.action(async options => CLI.start(options));
