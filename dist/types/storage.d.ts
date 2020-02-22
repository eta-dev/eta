interface Dict<T> {
    [key: string]: T;
}
declare class Cacher<T> {
    private cache;
    constructor(cache: Dict<T>);
    define(key: string, val: T): void;
    get(key: string): T;
    remove(key: string): void;
    reset(): void;
    load(cacheObj: Dict<T>): void;
}
export { Cacher };
