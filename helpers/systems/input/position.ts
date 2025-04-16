export class Position {
    constructor(public x: number, public y: number) {}

    array() {
        return [this.x, this.y] as [number, number];
    }
}