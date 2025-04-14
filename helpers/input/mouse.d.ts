declare namespace Mouse {
    type Buttons = {
        Left: 0;
        Middle: 1;
        Right: 2;
        Fourth: 3;
        Fifth: 4;
    }

    type Button = Buttons[keyof Buttons];
}