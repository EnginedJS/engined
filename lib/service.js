const Service = class {

	constructor(ctx) {
		this.ctx = ctx;
		this.dependencies = [];
		this.data = new Map();
	}

	getContext() {
		return this.ctx;
	}

	getData() {
		return this.data;
	}

	async start() {
		console.log('Not implmeneted:', 'Service.start()');
	}

	async stop() {
		console.log('Not implmeneted', 'Service.stop()');
	}
};

Service.create = function(data) {

	const userdata = data;

	const customizedService = class extends this {
		
		constructor(ctx) {
			super(ctx);

			Object.entries(userdata).forEach(([ key, value ]) => {
				this.data.set(key, value);
			});
		}
	};

	customizedService.getData = function() {
		return userdata;
	};

	return customizedService;
};

module.exports = Service;
