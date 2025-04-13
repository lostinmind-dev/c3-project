import { C3EventsHandler } from "./eventsHandler.ts";


export abstract class C3App extends C3EventsHandler<RuntimeEventMap> {
    readonly runtime: IRuntime;

    constructor(runtime: IRuntime) {
        super(runtime);
        this.runtime = runtime;

        this.on('beforeprojectstart', (e) => this.beforeStart());
        this.on('afterprojectstart', (e) => this.onStart());
    }

    protected abstract beforeStart(): void;
    protected abstract onStart(): void;
}

type C3AppConstructor<T extends C3App = C3App> = new (...args: any[]) => T;

export function config<T extends C3App>(app: C3AppConstructor<T>) {
    return new Promise<T>((resolve, reject) => {
        runOnStartup(runtime => resolve(new app(runtime)));
    });
}

