import { copyProps } from "./utils.ts";

/**
 * Handles storage and accessing of values
 *
 * In this case, we use it to store compiled template functions
 * Indexed by their `name` or `filename`
 */
class Cacher<T> {
  constructor(private cache: Record<string, T>) {}
  define(key: string, val: T): void {
    this.cache[key] = val;
  }
  get(key: string): T {
    // string | array.
    // TODO: allow array of keys to look down
    // TODO: create plugin to allow referencing helpers, filters with dot notation
    return this.cache[key];
  }
  remove(key: string): void {
    delete this.cache[key];
  }
  reset(): void {
    this.cache = {};
  }
  load(cacheObj: Record<string, T>): void {
    copyProps(this.cache, cacheObj);
  }
}

export { Cacher };
