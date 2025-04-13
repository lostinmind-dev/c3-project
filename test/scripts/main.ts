const test= ''
import { gsap } from 'gsap';
import { Instance } from '@instances/index.ts';
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";

runOnStartup(async runtime => {
	// console.log('tetwet')
	console.log(Instance, 1, 2, test)
	// console.log(te)
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.

	runtime.addEventListener('beforeprojectstart', () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime: IRuntime) {
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.

	runtime.addEventListener('tick', () => Tick(runtime));
}

function Tick(runtime: IRuntime) {
	// Code to run every tick
}
