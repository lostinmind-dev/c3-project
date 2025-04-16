declare class IConstructProjectObjects {}

declare type Constructor<T extends abstract new (...args: any) => any> = new (...args: ConstructorParameters<T>) => InstanceType<T>;

declare type IndexOf<T extends readonly unknown[], U, Acc extends number[] = []> =
    T extends readonly [infer F, ...infer R]
    ? F extends U
    ? Acc['length'] // Если нашли элемент, возвращаем текущую длину Acc как индекс
    : IndexOf<R, U, [...Acc, 0]> // Рекурсивно ищем в остатке, увеличивая счетчик
    : -1; // Элемент не найден

declare type ReversedArray<T extends unknown[]> =
    T extends [infer First, ...infer Rest]
    ? [...ReversedArray<Rest>, First]
    : [];