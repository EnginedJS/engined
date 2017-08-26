const AgentManager = require('./agent_manager');

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

	remove(key) {
		if (this.data[key] !== undefined) {
			delete this.data[key];
		}
	}

	assert(key) {

		let agentManager = this.data[key];

		if (agentManager === undefined) {
			agentManager = this.data[key] = new AgentManager();
		}

		return agentManager;
	}
};
