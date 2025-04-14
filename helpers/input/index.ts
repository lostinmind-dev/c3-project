import { 
    C3EventsHandler, 
    EventsHandler 
} from '../eventsHandler.ts';
import { Keyboard } from "./keyboard.ts";
import { Mouse } from "./mouse.ts";
import { Touch } from "./touch.ts";

class Position {
    constructor(public x: number, public y: number) {};
}

export class Positions {
    readonly start: Position = new Position(0, 0);
    readonly current: Position = new Position(0, 0);
    readonly previous: Position = new Position(0, 0);
    readonly end: Position = new Position(0, 0);
}

export class InputSystem extends EventsHandler<{
    /** Keyboard events */
    'key-pressed': Keyboard.Key; /** Key code */
    'key-released': Keyboard.Key; /** Key code */
    'key-combo-pressed': [Keyboard.Key, Keyboard.Key]; /** Two key codes */

    /** Mouse events */
    'mouse-button-pressed': Mouse.Button;
    'mouse-button-released': Mouse.Button;
    'mouse-move': void;
    'mouse-wheel-down': void;
    'mouse-wheel-up': void;

    /** Touch events */
    'touch-start': void;
    'touch-end': void;
    'touch-move': void;
}> {
    readonly #events: C3EventsHandler<RuntimeEventMap>;
    private readonly keyboard = new Keyboard();
    private readonly mouse = new Mouse();
    private readonly touch = new Touch();

    constructor(runtime: IRuntime) {
        super();
        this.#events = new C3EventsHandler(runtime);

        this.#events.on('keydown', (e) => {
            const keyCode = this.keyboard.onKeyDown(e);

            if (keyCode) {
                this.emit('key-pressed', keyCode as Keyboard.Key);

                const combo = this.keyboard.checkCombo(keyCode);

                if (combo) this.emit('key-combo-pressed', combo as [Keyboard.Key, Keyboard.Key]);
            }
        });

        this.#events.on('keyup', (e) => {
            const keyCode = this.keyboard.onKeyUp(e);

            this.emit('key-released', keyCode as Keyboard.Key);
        });

        this.#events.on('mousedown', (e) => {
            const button = this.mouse.onMouseDown(e);

            if (typeof button === 'number') this.emit('mouse-button-pressed', button as Mouse.Button);
        });
        this.#events.on('mousemove', (e) => {
            this.mouse.onMouseMove(e);

            this.emit('mouse-move');
        });
        this.#events.on('mouseup', (e) => {
            const button = this.mouse.onMouseUp(e);

            this.emit('mouse-button-released', button as Mouse.Button);
        });
        this.#events.on('wheel', (e) => {
            const direction = this.mouse.onWheelEvent(e);

            if (!direction) return;

            this.emit(`mouse-wheel-${direction}`);
        });

        this.#events.on('pointerdown', (e) => {
            this.touch.onPointerDown(e);

            this.emit('touch-start');
        });
        this.#events.on('pointermove', (e) => {
            this.touch.onPointerMove(e);

            this.emit('touch-move');
        });
        this.#events.on('pointerup', (e) => {
            this.touch.onPointerUp(e);

            this.emit('touch-end');
        });

        this.#events.on('tick', () => {
            this.keyboard.update();
            this.mouse.update();
        });
    }

    isKeyPressed(key: Keyboard.Key) {
        return this.keyboard.keys.get(key) === 'pressed';
    }

    isKeyReleased(key: Keyboard.Key) {
        return this.keyboard.keys.get(key) === 'up';
    }

    isComboActive(key1: Keyboard.Key, key2: Keyboard.Key) {
        return this.keyboard.combos.has([key1, key2]);
    }

    getMousePosition(type?: keyof Positions) {
        return this.mouse.positions[type || 'current'];
    }

    isButtonPressed(button: Mouse.Button) {
        return this.mouse.buttons.get(button) === 'pressed';
    }

    isButtonReleased(button: Mouse.Button) {
        return this.mouse.buttons.get(button) === 'up'
    }

    getTouchPosition(type?: keyof Positions) {
        return this.touch.positions[type || 'current'];
    }
}