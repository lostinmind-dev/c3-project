import { C3EventsHandler } from "../../eventsHandler.ts";
import { Position } from "./position.ts";

type TouchType = 'start' | 'end';
type Handler = (e: ConstructPointerEvent) => void;

export class TouchSystem extends C3EventsHandler<RuntimeEventMap> {
    private touching: boolean = false;

    private readonly touchListeners = new Map<TouchType, Set<Handler>>();
    private readonly moveHandlers = new Set<Handler>();

    readonly start: Position = new Position(0, 0);
    readonly current: Position = new Position(0, 0);
    readonly previous: Position = new Position(0, 0);
    readonly end: Position = new Position(0, 0);

    constructor(runtime: IRuntime) {
        super(runtime);

        this.on('pointerdown', (e) => this.#onDown(e));
        this.on('pointermove', (e) => this.#onMove(e));
        this.on('pointerup', (e) => this.#onUp(e));
    }

    onTouch(type: TouchType, handler: Handler) {
        let handlers = this.touchListeners.get(type);

        if (!handlers) {
            this.touchListeners.set(type, new Set());
            handlers = this.touchListeners.get(type)!;
        }

        handlers.add(handler);

        return () => {
            handlers.delete(handler);
        }
    }

    onMove(handler: Handler) {
        this.moveHandlers.add(handler);

        return () => {
            this.moveHandlers.delete(handler);
        }
    }

    isTouching() {
        return this.touching;
    }

    #onDown(e: ConstructPointerEvent) {
        this.start.x = e.clientX;
        this.start.y = e.clientY;

        this.touching = true;

        const handlers = this.touchListeners.get('start')

        if (!handlers) return;

        for (const handler of handlers) {
            handler(e);
        }
    }

    #onMove(e: ConstructPointerEvent) {
        this.previous.x = this.current.x;
        this.previous.y = this.current.y;

        this.current.x = e.clientX;
        this.current.y = e.clientY;

        for (const handler of this.moveHandlers) {
            handler(e);
        }
    }

    #onUp(e: ConstructPointerEvent) {
        this.end.x = e.clientX;
        this.end.y = e.clientY;

        this.touching = false;

        const handlers = this.touchListeners.get('end')

        if (!handlers) return;

        for (const handler of handlers) {
            handler(e);
        }
    }
}