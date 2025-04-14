class Misc {
    lerp(a: number, b: number, c: number) {
        return (a + (b - a) * c);
    }

    global<T>(varName: string, data: T) {
        //@ts-expect-error
        globalThis[varName] = data;
    }
}

export const misc = new Misc();