declare namespace Keyboard {
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
        Escape: {};
        Minus: {};
        Equal: {};
        Backspace: {};
        Tab: {};
        Semicolon: {};
        Quote: {};
        Backquote: {};
        Backslash: {};
        Comma: {};
        Period: {};
        Slash: {};
        Space: {};
        CapsLock: {};

        /** Numpad */
        NumpadMultiply: {};
        NumpadSubtract: {};
        NumpadAdd: {};
        NumpadDecimal: {};
        NumLock: {};

        PrintScreen: {};
        Pause: {};
        Home: {};
        End: {};
        Insert: {};
        Delete: {};
    } & {
        [Key in `${TwoSides[number]}${Side}`]: {};
    } & {
        [Key in `Digit${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`]: {};
    } & {
        [Key in `F${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`]: {};
    } & {
        [Key in `Numpad${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`]: {};
    } & {
        [Key in `Arrow${Direction}`]: {};
    } & {
        [Key in `Page${'Up' | 'Down'}`]: {};
    }

    type Key = keyof Keyboard.Keys | `Key${Uppercase<Chars[number]>}`;
}

// declare type KeyCode = Keyboard.Keys[Key]['code'];