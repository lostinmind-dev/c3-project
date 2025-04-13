import { C3EventsHandler } from "./eventsHandler.ts";


export abstract class C3App extends C3EventsHandler<RuntimeEventMap> {
    readonly runtime: IRuntime;

    constructor(runtime: IRuntime) {
        super(runtime);
        this.runtime = runtime;
    }
}

