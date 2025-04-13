import { C3EventsHandler } from "../utils.ts";
import { 
    type ExtractLayouts,
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


class App extends C3App<{}> {

    constructor(runtime: IRuntime) {
        super(runtime, {});

        // this.on()
    }
}


