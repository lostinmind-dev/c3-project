import { C3EventsHandler } from "../eventsHandler.ts";

type KeyState = 'up' | 'down' | 'pressed';
type Handler = (e: KeyboardEvent) => void;

type Side = 'Left' | 'Right';
type Direction = 'Up' | 'Left' | 'Right' | 'Down';

type TwoSides = [
    'Bracket', 'Control', 'Shift',
    'Alt',
];
type Chars = [
    'q', 'w', 'e', 'r', 't', 't',
    'y', 'u', 'i', 'o', 'p', 'a',
    's', 'd', 'f', 'g', 'h', 'j',
    'k', 'l', 'z', 'x', 'c', 'v',
    'b', 'n', 'm'
];

type Keys = {
    Escape: never;
    Minus: never;
    Equal: never;
    Backspace: never;
    Tab: never;
    Semicolon: never;
    Quote: never;
    Backquote: never;
    Backslash: never;
    Comma: never;
    Period: never;
    Slash: never;
    Space: never;
    CapsLock: never;

    /** Numpad */
    NumpadMultiply: never;
    NumpadSubtract: never;
    NumpadAdd: never;
    NumpadDecimal: never;
    NumLock: never;

    PrintScreen: never;
    Pause: never;
    Home: never;
    End: never;
    Insert: never;
    Delete: never;
} & {
    [Key in `${TwoSides[number]}${Side}`]: never;
} & {
    [Key in `Digit${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`]: never;
} & {
    [Key in `F${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`]: never;
} & {
    [Key in `Numpad${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`]: never;
} & {
    [Key in `Arrow${Direction}`]: never;
} & {
    [Key in `Page${'Up' | 'Down'}`]: never;
}

export type Key = keyof Keys | `Key${Uppercase<Chars[number]>}`;

export class KeyboardSystem extends C3EventsHandler<RuntimeEventMap> {
    private readonly pressListeners = new Map<string, Set<Handler>>();
    private readonly releaseListeneres = new Map<string, Set<Handler>>();

    private readonly keys = new Map<string, KeyState>();
    private previousKeys = new Map<string, KeyState>();

    constructor(runtime: IRuntime) {
        super(runtime);

        this.on('keydown', (e) => this.#onKeyDown(e));
        this.on('keyup', (e) => this.#onKeyUp(e));
        this.on('tick', () => this.#update());
    }

    onKeyPressed(key: Key, handler: Handler) {
        let handlers = this.pressListeners.get(key);

        if (!handlers) {
            this.pressListeners.set(key, new Set());
            handlers = this.pressListeners.get(key)!;
        }

        handlers.add(handler);

        return () => {
            handlers.delete(handler);
        }
    }

    onKeyReleased(key: Key, handler: Handler) {
        let handlers = this.releaseListeneres.get(key);

        if (!handlers) {
            this.releaseListeneres.set(key, new Set());
            handlers = this.releaseListeneres.get(key)!;
        }

        handlers.add(handler);

        return () => {
            handlers.delete(handler);
        }
    }

    isKeyPressed(key: Key) {
        return this.keys.get(key) === 'pressed';
    }

    isKeyReleased(key: Key) {
        return this.keys.get(key) === 'up';
    }

    #onKeyDown(e: KeyboardEvent) {
        const previousState = this.keys.get(e.code);

        if (previousState !== 'down') {
            this.keys.set(e.code, 'down');

            const handlers = this.pressListeners.get(e.code)

            if (!handlers) return;

            for (const handler of handlers) {
                handler(e);
            }
        }
    }

    #onKeyUp(e: KeyboardEvent) {
        this.keys.set(e.code, 'up');

        const handlers = this.releaseListeneres.get(e.code)

        if (!handlers) return;

        for (const handler of handlers) {
            handler(e);
        }
    }

    #update() {
        this.previousKeys = new Map(this.keys);

        this.keys.forEach((state, key) => {
            if (state === 'down' && this.previousKeys.get(key) === 'down') {
                this.keys.set(key, 'pressed');
            }
        });
    }
}