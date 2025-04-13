import { C3EventsHandler } from "./eventsHandler.ts";


export abstract class C3App extends C3EventsHandler<RuntimeEventMap> {
    readonly runtime: IRuntime;

    constructor(runtime: IRuntime) {
        super(runtime);
        this.runtime = runtime;

        this.on('beforeprojectstart', (e) => this.beforeStart());
        this.on('afterprojectstart', (e) => this.onStart());
    }

    abstract beforeStart(): void;
    abstract onStart(): void;
}

