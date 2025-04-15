import { C3App, TouchSystem } from '@c3-project/helpers';

export class App extends C3App {
    // t = new TouchSystem(this.runtime)
    protected override beforeStart() {
        this.on('tick', () => this.tick());
    }

    protected override onStart(): void {
        // console.log(createRequire)
    }

    private tick() {

    }
}