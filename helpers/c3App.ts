import { C3EventsHandler } from "./eventsHandler.ts";

type TickHandler = () => void;

export abstract class C3App extends C3EventsHandler<RuntimeEventMap> {
    readonly runtime: IRuntime;
    readonly #tickHandlers = new Set<TickHandler>();

    constructor(runtime: IRuntime) {
        super(runtime);
        this.runtime = runtime;

        this.on('beforeprojectstart', () => this.beforeStart());
        this.on('afterprojectstart', () => this.onStart());
        this.on('tick', () => this.#onTick());
    }

    onTick(handler: TickHandler) {
        this.#tickHandlers.add(handler);

        return () => {
            this.#tickHandlers.delete(handler);
        }
    }

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

    #onTick() {
        for (const handler of this.#tickHandlers) {
            handler();
        }
    }

    protected abstract beforeStart(): void;
    protected abstract onStart(): void;
}
