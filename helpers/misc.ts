export function lerp(a: number, b: number, c: number) {
    return (a + (b - a) * c);
}

export function global<T extends any>(varName: string, data: T) {
    //@ts-ignore global
    globalThis[varName] = data;
}