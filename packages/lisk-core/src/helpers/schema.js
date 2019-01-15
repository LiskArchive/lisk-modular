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

const sanitizeErrorMessages = errors => errors.reduce((acc, err) => `${acc}${err.code}: ${err.message}\n`, '');

// Decoupled setup from global state
const	validate = async (data) => {
	const result = await jsonRefs.resolveRefs(ConfigSchema);
	const schema = result.resolved.config; // THIS .config property KILLED ME :D

	if (!validator.validate(data, schema)) {
		const errors = validator.getLastErrors();
		throw new Error(sanitizeErrorMessages(errors));
	}
};

module.exports = {
	validate,
	sanitizeErrorMessages,
};
