
import type { C3App } from "../c3App.ts";


export abstract class Layout<
    Layers extends string[] = string[]
> {
    readonly layout: ILayout;

    constructor(layout: ILayout) {
        this.layout = layout;

        layout.addEventListener('beforelayoutstart', () => this.beforeStart());
        layout.addEventListener('beforelayoutend', () => this.beforeEnd());
        layout.addEventListener('afterlayoutstart', () => this.onStart());
        layout.addEventListener('afterlayoutend', () => this.onEnd());
    }

    protected abstract beforeStart(): void;
    protected abstract onStart(): void;
    protected abstract beforeEnd(): void;
    protected abstract onEnd(): void;

    getLayers<Name extends Layers[number]>(...names: Name[]) {
        const layers = [];

        for (const name of names) {
            layers.push(this.layout.getLayer(name)!);
        }
        return layers;
    }
}

export type ExtractLayouts<T> = T extends LayoutSystem<infer L> ? L : never;

export class LayoutSystem<
    Layouts extends Record<string, Constructor<typeof Layout>>,
> {
    private readonly app: C3App<any>;
    private readonly layouts = new Map<keyof Layouts, Layout>();

    /** Returns current active layout name */
    get name() {
        return this.app.runtime.layout.name as keyof Layouts;
    }

    constructor(app: C3App<any>, layouts: Layouts) {
        this.app = app;

        const allLayouts = app.runtime.getAllLayouts();

        for (const [name, layout] of Object.entries(layouts)) {
            const instance = new layout(
                allLayouts.find(layout => layout.name === name)!
            );

            this.layouts.set(name, instance);
        }
    }

    get<Name extends keyof Layouts>(name: Name) {
        return this.layouts.get(name)! as InstanceType<Layouts[Name]>;
    }

    goTo<Name extends keyof Layouts>(name: Name) {
        const instance = this.layouts.get(name);

        if (!instance) return;
        if (name === this.app.runtime.layout.name) return;

        try {
            this.app.runtime.goToLayout(instance.layout.name);
        } catch (e) {
            console.error('Error during transition', e);
        }
    }
}