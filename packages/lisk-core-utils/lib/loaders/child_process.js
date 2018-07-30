'use strict';

const ModuleFactory = require('../factories/modules');

const moduleName = process.argv[2];
const moduleOptions = JSON.parse(process.argv[3]);

const busProxy = {
	registerEvents: async (events) => {

	},
	registerActions: async (actions) => {

	}
};

const modulePackage = ModuleFactory.create('in_memory', moduleName, moduleOptions, null, busProxy);

console.log(`Loading child process for ${modulePackage.alias}(${modulePackage.pkg.version})...`);

process.title = `${modulePackage.alias} (${modulePackage.pkg.version})`;

modulePackage.load().then(() => {
	console.log(`Child process for ${modulePackage.alias} (${modulePackage.pkg.version}) loaded...`);
});


