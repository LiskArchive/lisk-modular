const moduleTypes = {};

const ModuleFactory = {
	register: (moduleType, moduleClass) => {
		if (moduleTypes[moduleType]) {
			throw new TypeError(`Module type "${moduleType}" already registered.`);
		}
		moduleTypes[moduleType] = moduleClass;
	},

	create: (moduleType, moduleName, options = {}, logger = null, bus = null) => {
		if (!moduleTypes[moduleType]) {
			throw new TypeError(`Module type "${moduleType}" not registered.`);
		}

		return new moduleTypes[moduleType](moduleName, options, logger, bus);
	},
};

ModuleFactory.register('in_memory', require('../modules/in_memory'));
ModuleFactory.register('child_process', require('../modules/child_process'));

module.exports = ModuleFactory;
