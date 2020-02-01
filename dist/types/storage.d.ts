interface ICache<T> {
    [key: string]: T;
}
declare class Cacher<T> {
    private cache;
    constructor(cache: ICache<T>);
    define(key: string, val: T): void;
    get(key: string): T;
    remove(key: string): void;
    reset(): void;
    load(cacheObj: ICache<T>): void;
}
export { Cacher };
