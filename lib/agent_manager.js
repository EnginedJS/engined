module.exports = class AgentManager {
	constructor() {
		this.agents = {};
	}

	register(agentName, agent) {
		this.agents[agentName] = agent;
	}

	unregister(agentName) {
		delete agents[agentName];
	}

	getAgent(agentName) {
		return this.agents[agentName]
	}
};
