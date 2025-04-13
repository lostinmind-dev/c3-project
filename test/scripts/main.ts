import { C3App, Misc } from '@c3-project/helpers';

export let app: App;

runOnStartup(runtime => { 
	app = new App(runtime)
});

class App extends C3App<{
	'Main': any;
}> {

	constructor(runtime: IRuntime) {
		super(runtime, {
			'Main': { test: 1 }
		});

		this.on('beforeprojectstart', () => this.beforeStart());

		Misc.global('app', this);

		this.layout.get('Main')
	}

	private beforeStart() {
		this.on('tick', () => this.tick());
	}

	private tick() {

	}
}
