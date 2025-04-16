export abstract class Container<
    RootInstance extends IWorldInstance,
    Instances extends Record<string, IWorldInstance> = Record<string, IWorldInstance>
> {
    readonly #instances = new Map<string, IWorldInstance>();
    readonly #root: RootInstance;

    get root() {
        return this.#root;
    }

    constructor(root?: RootInstance, instances?: Instances) {
        if (!root) {
            throw new Error(`Root instance was not provided for container [${Container.name}]`)
        };

        this.#root = root;

        if (instances) {
            for (const [id, instance] of Object.entries(instances)) {
                this.#instances.set(id, instance);
            }
        }
        
        root.addEventListener('hierarchyready', () => this.onReady());
    }

    getInstance<Id extends string & keyof Instances>(id: Id) {
        return this.#instances.get(id) as Instances[Id];
    }

    /** Calls when RootInstance fired hiearchyready */
    protected abstract onReady(): void;
    /** Calls when layout's 'onEnd()' method was called */
    abstract release(): void;
}

export abstract class Layout<Layers extends string[]> {
    readonly #_: ILayout;
    readonly #containers = new Map<string, InstanceType<typeof Container>>();
    abstract readonly containers: Record<string, Constructor<typeof Container>>;

    get name() {
        return this.#_.name;
    }

    /**
     * @param _ C3 Runtime ILayout instance
     */
    constructor(_: ILayout) {
        this.#_ = _;

        _.addEventListener('beforelayoutstart', (e) => {
            this.#initializeContainers();
            this.beforeStart(e)
        });
        _.addEventListener('beforelayoutend', (e) => this.beforeEnd(e));
        _.addEventListener('afterlayoutstart', (e) => this.onStart(e));
        _.addEventListener('afterlayoutend', (e) => {
            this.#releaseContainers();
            this.onEnd(e);
        });
    }

    getContainer<Id extends string & keyof typeof this['containers']>(id: Id) {
        return this.#containers.get(id)! as InstanceType<this['containers'][Id]>
    }

    getLayers<Name extends Layers[number]>(...names: Name[]) {
        const layers = [];

        for (const name of names) {
            const layer = this.#_.getLayer(name);
            if (!layer) continue;
            layers.push(layer);
        }
        return layers;
    }

    #initializeContainers() {
        if (!this.containers) return;

        for (const [id, container] of Object.entries(this.containers)) {
            this.#containers.set(
                id, 
                //@ts-ignore
                new container()
            );
        }
    }

    #releaseContainers() {
        for (const [id, container] of this.#containers) {
            container.release();
            this.#containers.delete(id);
        }
    }

    protected abstract beforeStart(e: LayoutEvent): void;
    protected abstract onStart(e: LayoutEvent): void;
    protected abstract beforeEnd(e: LayoutEvent): void;
    protected abstract onEnd(e: LayoutEvent): void;
}

export class LayoutsSystem<
    Layouts extends Record<string, Constructor<typeof Layout>>
> {
    readonly #runtime: IRuntime;
    readonly #layouts = new Map<string, InstanceType<typeof Layout>>();

    /** Returns current active layout */
    get layout() {
        const name = this.#runtime.layout.name as string & keyof Layouts;

        return this.#layouts.get(name) as InstanceType<Layouts[typeof name]>;
    }

    constructor(runtime: IRuntime, layouts: Layouts) {
        this.#runtime = runtime;

        for (const [name, layout] of Object.entries(layouts)) {
            const _ = runtime.getAllLayouts().find(l => l.name === name);

            if (!_) {
                console.error(`Layout with name [${name}] was not found at runtime!`);
                continue;
            }

            this.#layouts.set(name, new layout(_));
        }
    }

    get<Name extends string & keyof Layouts>(name: Name) {
        return this.#layouts.get(name) as InstanceType<Layouts[Name]>;
    }

    goTo<Name extends string & keyof Layouts>(name: Name) {
        if (!this.#layouts.has(name)) return;
        if (name === this.layout.name) return;

        this.#runtime.goToLayout(name);
    }

    /**
     * The same as goTo() method but wait for delay time
     * @param name Layout name
     * @param delay Delay before switching the layout (in seconds)
     * @example 0.25
     */
    goToAsync<Name extends string & keyof Layouts>(name: Name, delay: number) {
        return new Promise<void>((resolve, reject) => {
            if (!this.#layouts.has(name)) {
                reject(`Layout with name [${name}] was not found`);
                return;
            }
            if (name === this.layout.name) {
                reject(`Current layout name is the same [${name}]`);
                return;
            }

            setTimeout(() => resolve(), delay * 1000)
        })
    }
}