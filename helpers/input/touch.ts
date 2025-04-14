import { Positions } from "./index.ts";

export class Touch {
    readonly positions = new Positions();

    #touching: boolean = false;

    get touching() {
        return this.#touching;
    }

    onPointerDown(e: ConstructPointerEvent) {
        this.positions.start.x = e.clientX;
        this.positions.start.y = e.clientY;

        this.#touching = true;
    }

    onPointerMove(e: ConstructPointerEvent) {
        this.positions.previous.x = this.positions.current.x;
        this.positions.previous.y = this.positions.current.y;

        this.positions.current.x = e.clientX;
        this.positions.current.y = e.clientY;
    } 

    onPointerUp(e: ConstructPointerEvent) {
        this.positions.end.x = e.clientX;
        this.positions.end.y = e.clientY;

        this.#touching = false;
    }
}