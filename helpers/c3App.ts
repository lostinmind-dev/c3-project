import { C3EventsHandler } from "./eventsHandler.ts";
import { 
    type Layout,
    LayoutSystem, 
} from "./systems/layout.ts";

export abstract class C3App<
    Layouts extends Record<string, Constructor<typeof Layout>>
> extends C3EventsHandler<RuntimeEventMap> {
    readonly runtime: IRuntime;
    readonly layout: LayoutSystem<Layouts>;


    constructor(runtime: IRuntime, layouts: Layouts) {
        super(runtime);
        this.runtime = runtime;
        this.layout = new LayoutSystem(this, layouts);
    }
}

