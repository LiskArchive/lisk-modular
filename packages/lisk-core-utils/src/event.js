module.exports = class Event {
	/**
	 *
	 * @param name - Can be simple event or be combination of module:event
	 * @param data - Data associated with the event
	 * @param moduleName - Module name if event name does not have its prefix
	 */
	constructor(name, data = null, moduleName = null) {
		const eventName = name.split(':');
		this.name = eventName.pop();
		this.data = data;
		this.module = eventName[0] || moduleName;

		if (!this.module) {
			throw new Error(
				`Can't create an event ${this.name} without a module specified.`,
			);
		}

		this.isValidEventName(this.name);
	}

	toJSON() {
		return { name: this.name, module: this.module, data: this.data };
	}

	toString() {
		return `${this.module}:${this.name}`;
	}

	toEmitterName() {
		return `${this.module}:${this.name}`;
	}

	isValidEventName(name, throwError = true) {
		const result = /^[A-Za-z0-9:]+$/.test(name);
		if (throwError && !result) {
			throw new Error(`[${this.module}] Invalid event name ${name}.`);
		}
		return result;
	}
};
