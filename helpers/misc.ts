class Misc {
    lerp(a: number, b: number, c: number) {
        return (a + (b - a) * c);
    }
}

export const misc = new Misc();