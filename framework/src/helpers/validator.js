const ZSchema = require('z-schema');

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

module.exports = {
	validate: (data, schema) => {
		if (!validator.validate(data, schema)) {
			return validator.getLastErrors();
		}

		return [];
	},
};
