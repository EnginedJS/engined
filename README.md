# Engined

A micro framework for application in Node.js. it aims to provide a way to manage your services inside instance.

## Requirements

Engined widely uses async/await in ES6+ so Node.js v7.4+ is required and v7.6 is prefered. If you are working on Node.js v7.6, you have to run Node.js with `--harmony-async-await` options.


## Installation

You can just install module via NPM:

```shell
npm install engined
```

## Get Started

Here is an example to use engined to manange services:

```javascript
const { Manager, Service } = require('engined');

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
```

## Usage

`engined.Manager` class provides serveral methods for service management.

### Load modules at once

There is a way to load multiple modules with `loadServices` method at once.

```javascript
await serviceManager.loadServices({
	MyService1: MyService,
	MyService2: MyService
});
```

### Add and remove specific service

Add and remove specific service with `add` and `remove` method.

```javascript
serviceManager.add('MyService1', MyService);
serviceManager.remove('MyService1');
```

Note that `remove` will stop service if service is running.

### Start and stop specific service

It can start and stop specific service with `start` and `stop` method.

```javascript
await serviceManager.start('MyService1');
await serviceManager.stop('MyService1');
```

## Accessing Context

Sharing data among services is allowed, just save it in the context object. `engined.Manager` and `engined.Service` classes provide a method for accessing the context object.

### Get context via service manager

`engined.Manager` provide `getContext` method to get current `Context` instance:

```javascript
let context = serviceManager.getContext();
```

### Get context from inside the service

`engined.Service` provide `getContext` method to get current `Context` instance:

```javascript
let context = this.getContext();
```

### Store data in context object

Store custom key/value pairs by calling `set` method.

```javascript
context.set('mykey', 'test');
```

### Get data from context object

Get key/value pairs by calling `get` method.

```javascript
let mykey = context.get('mykey');
```

## Agent Manager

`engined.AgentManager` was designed in order to manage multiple agents. We usually expose agent manager to other services via context object.

Manager service can be implmeneted like below:

```javascript
class fooManagerService extends Service {

	constructor(context) {
		super(context);

		this.agentManager = null;
	}


	async start() {
		this.agentManager = new AgentManager();
		this.getContext().set('foo', agentManager);
	}

	async stop() {

		if (this.agentManager === null)
			return;

		this.getContext().remove('foo');
		this.agentManager = null;

	}

```

Then we can implement agent service and register agent in above manager service:

```javascript
class fooAgentService extends Service {

	constructor(context) {
		super(context);

		this.agent = null;
	}


	async start() {
		this.agent = {
			data: 'Hello'
		};
		this.getContext().get('foo').register('AgentA', this.agent);
	}

	async stop() {

		if (this.agent === null)
			return;

		this.getContext().get('foo').unregister('AgentA');
		this.agent = null;

	}
```

In other services, `getAgent()` is the way to accessing specific agent of manager.

```javascript
let agent = this.getContext().get('foo').getAgent('AgentA');

console.log(agent.data);
```

### Easy way to assert agent manager in context

There is a way to create agent manager then register on context faster.

```javascript
this.getContext().assert('foo');
```

## License
Licensed under the MIT License
 
## Authors
Copyright(c) 2017 Fred Chien（錢逢祥） <<cfsghost@gmail.com>>
