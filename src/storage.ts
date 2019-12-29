import SqrlErr from './err'

interface ICache<T> {
  [key: string]: T
}

declare class Cacher<T> {
  constructor (initialCache: ICache<T>)
  define (key: string, val: T): void
  get (key: string): T
  remove (key: string): void
  clear (): void
  load (cacheObj: ICache<T>): void
}

interface CacheClass<T> {
  define(key: string, val: T): void
  get(key: string): T
  remove(key: string): void
  clear(): void
  load(cacheObj: ICache<T>): void
}

function Cacher<T> (this: CacheClass<T>, initialCache: ICache<T>) {
  var cache: ICache<T> = initialCache
  this.define = function (key: string, val: T) {
    cache[key] = val
  }
  this.get = function (key: string) {
    if (cache[key]) {
      return cache[key]
    } else {
      throw SqrlErr("Key '" + key + "' doesn't exist")
    }
  }
  this.remove = function (key: string) {
    delete cache[key]
  }
  this.clear = function () {
    cache = {}
  }
  this.load = function (cacheObj: ICache<T>) {
    cache = cacheObj
  }
}

export { Cacher }
