const logger = require('@lisk/lisk-logger-bunyan');

const componentsList = {};
const componentsConfigCache = {};

const ComponentFactory = {
	register: (component, constructorFunction) => {
		componentsList[component] = constructorFunction;
	},

	create: (component, config = null) => {
		if (config) {
			componentsConfigCache[component] = config;
		}

		return componentsList[component](componentsConfigCache[component]);
	},
};

ComponentFactory.register('logger', logger);

module.exports = ComponentFactory;
