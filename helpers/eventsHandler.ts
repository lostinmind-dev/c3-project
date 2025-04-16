type Handler<Data = any> = (data: Data) => void;

export class EventsHandler<Events extends Record<string, any>> {
    readonly #events = new Map<keyof Events, Set<Handler>>();

    public on<Event extends keyof Events>(event: Event, handler: Handler<Events[Event]>) {
        let handlers = this.#events.get(event);

        if (!handlers) {
            this.#events.set(event, new Set([handler]));
            handlers = this.#events.get(event)!;
        }

        handlers.add(handler);

        return () => {
            handlers.delete(handler);
            if (handlers.size === 0) this.#events.delete(event);
        }
    }

    protected release() {
        this.#events.clear();
    }

    protected emit<Event extends keyof Events>(event: Event, ...data: Events[Event] extends void ? [] : [Events[Event]]) {
        const handlers = this.#events.get(event);

        if (!handlers) return;

        for (const handler of handlers) {
            handler(data[0]);
        }
    }
}

export class C3EventsHandler<
    Events extends Record<string, any>,
    Ref extends ConstructEventTarget<Events> = ConstructEventTarget<Events>
> {
    readonly #ref: Ref;
    readonly #events = new Map<keyof Events, Set<Handler>>();

    constructor(ref: Ref) {
        this.#ref = ref;
    }

    protected on<Event extends keyof Events>(event: Event, handler: (data: Events[Event]) => void): () => void {
        this.#ref.addEventListener(event, handler);

        let handlers = this.#events.get(event);

        if (!handlers) {
            this.#events.set(event, new Set([handler]));
            handlers = this.#events.get(event)!;
        }

        handlers.add(handler);

        return () => {
            this.#ref.removeEventListener(event, handler);
            handlers.delete(handler);
            if (handlers.size === 0) this.#events.delete(event);
        }
    }

    protected release(): void {
        for (const [event, handlers] of this.#events) {
            for (const handler of handlers) {
                this.#ref.removeEventListener(event, handler);
            }
        }
    }
}