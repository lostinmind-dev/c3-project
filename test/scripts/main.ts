import { C3App, Misc } from '@lostinmind/c3-project/helpers';

export let app: App;

runOnStartup(runtime => { 
	app = new App(runtime)
});

class App extends C3App<{

}> {

	constructor(runtime: IRuntime) {
		super(runtime, {});

		this.on('beforeprojectstart', () => this.beforeStart());

		Misc.global('app', this);
		console.log('Initi')
	}

	private beforeStart() {
		this.on('tick', () => this.tick());
	}

	private tick() {

	}
}
