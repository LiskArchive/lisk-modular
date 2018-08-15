const assert = require('assert');

const moduleNameReg = /^[a-zA-Z][a-zA-Z0-9]*$/;
const eventWithModuleNameReg = /^[a-zA-Z][a-zA-Z0-9]*:[a-zA-Z][a-zA-Z0-9]*$/;

module.exports = class Event {
	/**
	 *
	 * @param name - Can be simple event or be combination of module:event
	 * @param source - Source module which triggers the event
	 * @param data - Data associated with the event
	 */
	constructor(name, data = null, source = null) {
		assert(
			eventWithModuleNameReg.test(name),
			`Event name "${name}" must be a valid name with module name.`,
		);

		[this.module, this.name] = name.split(':');
		this.data = data;

		if (source) {
			assert(
				moduleNameReg.test(source),
				`Source name "${source}" must be a valid module name.`,
			);
			this.source = source;
		}
	}

	serialize() {
		return {
			name: this.name,
			module: this.module,
			source: this.source,
			data: this.data,
		};
	}

	toString() {
		return `${this.source} -> ${this.module}:${this.name}}`;
	}

	key() {
		return `${this.module}:${this.name}`;
	}

	static deserialize(data) {
		let object = null;
		if (typeof data === 'string') object = JSON.parse(data);
		else object = data;
		return new Event(
			`${object.module}:${object.name}`,
			object.data,
			object.source,
		);
	}
};
