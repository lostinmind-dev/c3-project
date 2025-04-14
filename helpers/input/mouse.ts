import { C3EventsHandler } from "../eventsHandler.ts";
import { Position } from "./position.ts";

type ButtonState = 'up' | 'down' | 'pressed';
type Handler = (e: MouseEvent) => void;

type WheelDirection = 'up' | 'down';

export const buttons = {
    left: 0,
    middle: 1,
    right: 2,

    fourth: 3,
    fifth: 4,
} as const;

type ButtonIndex = typeof buttons[keyof typeof buttons];

export class MouseSystem extends C3EventsHandler<RuntimeEventMap> {
    private readonly pressListeners = new Map<number, Set<Handler>>();
    private readonly releaseListeneres = new Map<number, Set<Handler>>();
    private readonly wheelListeners = new Map<WheelDirection, Set<Handler>>();

    private readonly buttons = new Map<number, ButtonState>();
    private previousButtons = new Map<number, ButtonState>();

    readonly start: Position = new Position(0, 0);
    readonly current: Position = new Position(0, 0);
    readonly previous: Position = new Position(0, 0);
    readonly end: Position = new Position(0, 0);

    constructor(runtime: IRuntime) {
        super(runtime);

        this.on('mousedown', (e) => this.#onDown(e));
        this.on('mousemove', (e) => this.#onMove(e));
        this.on('mouseup', (e) => this.#onUp(e));
        this.on('wheel', (e) => this.#onWheel(e));
        this.on('tick', () => this.#update());
    }

    onButtonPressed(button: keyof typeof buttons, handler: Handler) {
        let handlers = this.pressListeners.get(buttons[button]);

        if (!handlers) {
            this.pressListeners.set(buttons[button], new Set());
            handlers = this.pressListeners.get(buttons[button])!;
        }

        handlers.add(handler);

        return () => {
            handlers.delete(handler);
        }
    }

    onButtonReleased(button: keyof typeof buttons, handler: Handler) {
        let handlers = this.releaseListeneres.get(buttons[button]);

        if (!handlers) {
            this.releaseListeneres.set(buttons[button], new Set());
            handlers = this.releaseListeneres.get(buttons[button])!;
        }

        handlers.add(handler);

        return () => {
            handlers.delete(handler);
        }
    }

    onMouseWheel(direction: WheelDirection, handler: Handler) {
        let handlers = this.wheelListeners.get(direction);

        if (!handlers) {
            this.wheelListeners.set(direction, new Set());
            handlers = this.wheelListeners.get(direction)!;
        }

        handlers.add(handler);

        return () => {
            handlers.delete(handler);
        }
    }

    isButtonPressed(button: ButtonIndex) {
        return this.buttons.get(button) === 'pressed';
    }

    isButtonReleased(button: ButtonIndex) {
        return this.buttons.get(button) === 'up'
    }

    #onWheel(e: WheelEvent) {
        const direction: WheelDirection = (e.deltaY > 0) ? 'down' : 'up';

        const handlers = this.wheelListeners.get(direction)

        if (!handlers) return;

        for (const handler of handlers) {
            handler(e);
        }
    }

    #onDown(e: MouseEvent) {
        this.start.x = e.clientX;
        this.start.y = e.clientY;

        const previousState = this.buttons.get(e.button);

        if (previousState !== 'down') {
            this.buttons.set(e.button, 'down');

            const handlers = this.pressListeners.get(e.button)

            if (!handlers) return;

            for (const handler of handlers) {
                handler(e);
            }
        }
    }

    #onMove(e: MouseEvent) {
        this.previous.x = this.current.x;
        this.previous.y = this.current.y;

        this.current.x = e.clientX;
        this.current.y = e.clientY;
    }

    #onUp(e: MouseEvent) {
        this.end.x = e.clientX;
        this.end.y = e.clientY;

        this.buttons.set(e.button, 'up');

        const handlers = this.releaseListeneres.get(e.button)

        if (!handlers) return;

        for (const handler of handlers) {
            handler(e);
        }
    }

    #update() {
        this.previousButtons = new Map(this.buttons);

        this.buttons.forEach((state, button) => {
            if (state === 'down' && this.previousButtons.get(button) === 'down') {
                this.buttons.set(button, 'pressed');
            }
        });
    }
}