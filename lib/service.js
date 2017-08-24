
const Service = module.exports = class {

	constructor(ctx) {
		this.ctx = ctx;
	}

	getContext() {
		return this.ctx;
	}

	async start() {
		console.log('Not implmeneted:', 'Service.start()');
	}

	async stop() {
		console.log('Not implmeneted', 'Service.stop()');
	}
};
