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

    addInstances<T extends Record<keyof IConstructProjectObjects, Function>>(instances: Partial<T>) {
        for (const [objectName, klass] of Object.entries(instances)) {
            //@ts-ignore
            this.runtime.objects[objectName as keyof IConstructProjectObjects].setInstanceClass(klass);
        }
    }

    addPromises(promises: Promise<void>[]) {
        for (const promise of promises) {
            this.runtime.sdk.addLoadPromise(promise);
        }
    }
}
