'use strict';

const ChildProcessModule = require('../modules/child_process_module');

const moduleName = process.argv[2];
const moduleOptions = JSON.parse(process.argv[3]);

ChildProcessModule.forkProcess(moduleName, moduleOptions).then(() => {
	console.debug(`Child process for ${moduleName} started...`);
});