class EventsHandler {
    events = new Map();
    on(event, handler) {
        let handlers = this.events.get(event);
        if (!handlers) {
            this.events.set(event, new Set([
                handler
            ]));
            handlers = this.events.get(event);
        }
        handlers.add(handler);
        return ()=>{
            handlers.delete(handler);
            if (handlers.size === 0) this.events.delete(event);
        };
    }
    release() {
        this.events.clear();
    }
    emit(event, ...data) {
        const handlers = this.events.get(event);
        if (!handlers) return;
        for (const handler of handlers){
            handler(data[0]);
        }
    }
}
class C3EventsHandler extends EventsHandler {
    #obj;
    constructor(obj){
        super();
        this.#obj = obj;
    }
    on(event, handler) {
        this.#obj.addEventListener(event, handler);
        let handlers = this.events.get(event);
        if (!handlers) {
            this.events.set(event, new Set([
                handler
            ]));
            handlers = this.events.get(event);
        }
        handlers.add(handler);
        return ()=>{
            this.#obj.removeEventListener(event, handler);
            handlers.delete(handler);
            if (handlers.size === 0) this.events.delete(event);
        };
    }
    release() {
        for (const [event, handlers] of this.events){
            for (const handler of handlers){
                this.#obj.removeEventListener(event, handler);
            }
        }
        super.release();
    }
}
class LayoutSystem {
    app;
    layouts = new Map();
    get name() {
        return this.app.runtime.layout.name;
    }
    constructor(app, layouts){
        this.app = app;
        const allLayouts = app.runtime.getAllLayouts();
        for (const [name, layout] of Object.entries(layouts)){
            const instance = new layout(allLayouts.find((layout)=>layout.name === name));
            this.layouts.set(name, instance);
        }
    }
    get(name) {
        return this.layouts.get(name);
    }
    goTo(name) {
        const instance = this.layouts.get(name);
        if (!instance) return;
        if (name === this.app.runtime.layout.name) return;
        try {
            this.app.runtime.goToLayout(instance.layout.name);
        } catch (e) {
            console.error('Error during transition', e);
        }
    }
}
class C3App extends C3EventsHandler {
    runtime;
    layout;
    constructor(runtime, layouts){
        super(runtime);
        this.runtime = runtime;
        this.layout = new LayoutSystem(this, layouts);
    }
}
function lerp(a, b, c) {
    return a + (b - a) * c;
}
function global(varName, data) {
    globalThis[varName] = data;
}
const mod = {
    lerp: lerp,
    global: global
};
let app;
runOnStartup((runtime)=>{
    app = new App(runtime);
});
class App extends C3App {
    constructor(runtime){
        super(runtime, {});
        this.on('beforeprojectstart', ()=>this.beforeStart());
        mod.global('app', this);
        console.log('Initi');
    }
    beforeStart() {
        this.on('tick', ()=>this.tick());
    }
    tick() {}
}
export { app as app };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9sb3N0aW5taW5kLWRldi9jMy1wcm9qZWN0L3JlZnMvaGVhZHMvbWFpbi9oZWxwZXJzL2V2ZW50c0hhbmRsZXIudHMiLCJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbG9zdGlubWluZC1kZXYvYzMtcHJvamVjdC9yZWZzL2hlYWRzL21haW4vaGVscGVycy9zeXN0ZW1zL2xheW91dC50cyIsImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9sb3N0aW5taW5kLWRldi9jMy1wcm9qZWN0L3JlZnMvaGVhZHMvbWFpbi9oZWxwZXJzL2MzQXBwLnRzIiwiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2xvc3Rpbm1pbmQtZGV2L2MzLXByb2plY3QvcmVmcy9oZWFkcy9tYWluL2hlbHBlcnMvbWlzYy50cyIsImZpbGU6Ly8vQzovVXNlcnMvbGxvc3QvRG9jdW1lbnRzL0dpdEh1Yi9Qcm9qZWN0cy9AbG9zdGltaW5kL2MzLXByb2plY3QvdGVzdC9zY3JpcHRzL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRU8sTUFBTTtJQUNVLFNBQVMsSUFBSSxNQUFrQztJQUUzRCxHQUErQixLQUFZLEVBQUUsT0FBK0IsRUFBRTtRQUNqRixJQUFJLFdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFFL0IsSUFBSSxDQUFDLFVBQVU7WUFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksSUFBSTtnQkFBQzthQUFRO1lBQ3hDLFdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDL0I7UUFFQSxTQUFTLEdBQUcsQ0FBQztRQUViLE9BQU87WUFDSCxTQUFTLE1BQU0sQ0FBQztZQUNoQixJQUFJLFNBQVMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEQ7SUFDSjtJ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