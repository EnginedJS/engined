const { Manager, Service } = require('../');

class MyService extends Service {

	constructor(context) {
		super(context);

		this.counter = 0;
	}

	delay(interval) {
		return new Promise((resolve) => {
			setTimeout(resolve, interval);
		});
	}

	async start() {

		// Getting global counter from context
		this.counter = this.getContext().get('global_counter') || 0;

		for (let index = 0; index < 10; index++) {
			this.counter++;
			console.log(this.counter);
			await this.delay(100);
		}

		this.getContext().set('global_counter', this.counter);
	}

	async stop() {

		// Getting global counter from context
		this.counter = this.getContext().get('global_counter') || 0;

		for (let index = 0; index < 10; index++) {
			this.counter--;
			console.log(this.counter);
			await this.delay(100);
		}

		this.getContext().set('global_counter', this.counter);
	}
}

const main = async () => {

	// Create manager
	let serviceManager = new Manager({ verbose: true });

	// Adding services to manager
	serviceManager.add('MyService1', MyService);
	serviceManager.add('MyService2', MyService);

	// Start all services and stop
	await serviceManager.startAll();
	await serviceManager.stopAll();

	console.log('exit');
};

main();
