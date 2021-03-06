const Context = require('./context');

const dummyConsole = {
	log: () => {},
	error: () => {},
	warn: () => {}
};

module.exports = class {

	constructor() {

		let opts;
		if (!(arguments[0] instanceof Context)) {
			this.ctx = new Context();
			opts = arguments[0];
		} else {
			this.ctx = arguments[0];
			opts = arguments[1];
		}

		this.name = 'Engined';
		this.services = {};
		this.instances = {};
		this.opts = Object.assign({
			verbose: false
		}, opts || {});

		this.console = this.opts.verbose ? console : dummyConsole;
	}

	getContext() {
		return this.ctx;
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

		let service = this.services[name] || null;
		if (service === null)
			throw new Error('No such service: ' + name);

		let instance = new service(this.ctx);
		this.instances[name] = instance;

		// Check dependencies if service have settings
		if (instance.dependencies !== undefined) {

			// check whether service exists or not
			const inexists = instance.dependencies.find((depName) => {
				return (this.services[depName] === undefined);
			});

			if (inexists) {
				throw new Error('\"' + name + '\" depends on \"' + inexists + '\", but no such service exists.');
			}

			// check the order of starting
			const ret = instance.dependencies.find((depName) => {
				return (this.instances[depName] === undefined);
			});

			if (ret) {
				throw new Error('\"' + name + '\" depends on \"' + ret + '\", and that service should be started before.');
			}
		}

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

		// Reverse service ordering
		let names = Object.keys(this.instances).reverse()[Symbol.iterator]();

		for (let name of names) {
			await this.stop(name);
		}
	}
};
