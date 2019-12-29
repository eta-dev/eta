interface ICache<T> {
    [key: string]: T;
}
declare class Cacher<T> {
    constructor(initialCache: ICache<T>);
    define(key: string, val: T): void;
    get(key: string): T;
    remove(key: string): void;
    clear(): void;
    load(cacheObj: ICache<T>): void;
}
interface CacheClass<T> {
    define(key: string, val: T): void;
    get(key: string): T;
    remove(key: string): void;
    clear(): void;
    load(cacheObj: ICache<T>): void;
}
declare function Cacher<T>(this: CacheClass<T>, initialCache: ICache<T>): void;
export { Cacher };
