'use strict';

const componentsList = {};
const componentsConfigCache = {};

const ComponentFactory = module.exports = {

	register: (component, constructorFunction) => {
		componentsList[component] = constructorFunction;
	},

	create: (component, config = null) => {
		if(config) {
			componentsConfigCache[component] = config;
		} else {
			config = componentsConfigCache[component];
		}
		return componentsList[component](config);
	}
};
