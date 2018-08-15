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

module.exports = ComponentFactory;
