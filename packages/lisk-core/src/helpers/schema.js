const ZSchema = require('z-schema');
const jsonRefs = require('json-refs');
const ConfigSchema = require('../schema/config');

const validator = new ZSchema({
	forceAdditional: true,
	forceItems: true,
	forceMaxLength: false,
	forceProperties: false,
	noExtraKeywords: true,
	noTypeless: true,
	noEmptyStrings: true,
	noEmptyArrays: true,
});

let resolvedRefsSpec = null;

module.exports = {
	validate: (data, schema) => {
		if (!validator.validate(data, schema)) {
			return validator.getLastErrors();
		}

		return [];
	},

	setup: async () => {
		if (resolvedRefsSpec) return Promise.resolve();

		return jsonRefs
			.resolveRefs(Object.assign({}, ConfigSchema), {})
			.then((results) => {
				resolvedRefsSpec = results.resolved;
			});
	},

	getSchema: () => resolvedRefsSpec,
};
