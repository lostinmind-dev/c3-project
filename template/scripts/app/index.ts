import { C3App } from '@c3-project/helpers';

export class App extends C3App {
    protected override beforeStart() {
        this.onTick(() => this.tick());
    }

    protected override onStart(): void {

    }

    private tick() {

    }
}