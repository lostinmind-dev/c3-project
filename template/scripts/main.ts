import { App } from "@app/index.ts";

export let app: App;

runOnStartup(runtime => {
	app = new App(runtime)
});
