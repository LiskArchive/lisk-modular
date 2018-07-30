'use strict';

const moduleTypes = {};

const ModuleFactory = module.exports = {

	register: (moduleType, moduleClass) => {
		if(moduleTypes[moduleType]) {
			throw new TypeError(`Module type "${moduleType}" already registered.`);
		}
		moduleTypes[moduleType] = moduleClass;
	},

	create: (moduleType, moduleName, options={}, controller=null, bus=null) => {
		if (!moduleTypes[moduleType]) {
			throw new TypeError(`Module type "${moduleType}" not registered.`);
		}

		if(moduleType === 'in_memory') {
			return new moduleTypes[moduleType](moduleName, options, bus);
		} else {
			return new moduleTypes[moduleType](moduleName, options, bus);
		}
	}
};

ModuleFactory.register('in_memory', require('../modules/in_memory_module'));
ModuleFactory.register('child_process', require('../modules/child_process_module'));
