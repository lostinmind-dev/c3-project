import { Positions } from "./index.ts";

type ButtonState = 'up' | 'down' | 'pressed';

export class Mouse {
    readonly buttons = new Map<number, ButtonState>();
    previousButtons = new Map<number, ButtonState>();

    readonly positions = new Positions();

    onMouseDown(e: MouseEvent) {
        this.positions.start.x = e.clientX;
        this.positions.start.y = e.clientY;

        const previousState = this.buttons.get(e.button);

        if (previousState !== 'down') {
            this.buttons.set(e.button, 'down');
            return e.button;
        }
    }

    onMouseMove(e: MouseEvent) {
        this.positions.previous.x = this.positions.current.x;
        this.positions.previous.y = this.positions.current.y;

        this.positions.current.x = e.clientX;
        this.positions.current.y = e.clientY;
    }

    onMouseUp(e: MouseEvent) {
        this.positions.end.x = e.clientX;
        this.positions.end.y = e.clientY;

        this.buttons.set(e.button, 'up');
        
        return e.button;
    }

    onWheelEvent(e: WheelEvent) {
        if (e.deltaY > 0) {
            return 'down';
        } else if (e.deltaY < 0) {
            return 'up';
        }
    }

    update() {
        this.previousButtons = new Map(this.buttons);

        this.buttons.forEach((state, button) => {
            if (state === 'down' && this.previousButtons.get(button) === 'down') {
                this.buttons.set(button, 'pressed');
            }
        });
    }
}