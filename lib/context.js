module.exports = class {

	constructor(initialObj) {
		this.data = initialObj || {};
	}

	set(key, value) {
		this.data[key] = value;
	}

	get(key) {
		return this.data[key];
	}
};
