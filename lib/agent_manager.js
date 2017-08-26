module.exports = class AgentManager {
	constructor() {
		this.agents = {};
	}

	register(agentName, agent) {
		if (this.agents[agentName] !== undefined)
			throw new Error('Failed to register. ' + agentName + ' agent exists already');

		this.agents[agentName] = agent;
	}

	unregister(agentName) {

		if (this.agents[agentName] !== undefined)
			delete this.agents[agentName];
	}

	getAgent(agentName) {
		return this.agents[agentName]
	}

	count() {
		return Object.keys(this.agents).length;
	}
};
