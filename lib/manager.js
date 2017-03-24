
const dummyConsole = {
	log: () => {},
	error: () => {},
	warn: () => {}
};

module.exports = class {

	constructor(ctx, opts) {
		this.ctx = ctx;
		this.name = 'Engined';
		this.services = {};
		this.instances = {};
		this.opts = Object.assign({
			verbose: false
		}, opts);

		this.console = this.opts.verbose ? console : dummyConsole;
	}

	async loadServices(services) {

		for (let key in services) {
			await this.add(key, services[key]);
		}
	}

	async add(name, service) {
		this.services[name] = service;
	}

	async remove(name) {

		await this.stop(name);

		delete this.services[name];
	}

	async start(name) {

		this.console.log('<' + this.name + '>', 'Starting service:', name);

		let instance = new this.services[name](this.ctx);
		this.instances[name] = instance;

		await instance.start();
	}

	async startAll() {

		this.console.log('<' + this.name + '>', 'Starting all services');

		for (let key in this.services) {
			await this.start(key);
		}

	}

	async stop(name) {

		this.console.log('<' + this.name + '>', 'Stopping service:', name);

		let instance = this.instances[name];
		if (!instance)
			return;

		await instance.stop();
		delete this.instances[name];
	}

	async stopAll() {

		this.console.log('<' + this.name + '>', 'Stopping all services');

		for (let name in this.instances) {
			await this.stop(name);
		}
	}
};
