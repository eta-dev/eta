import SqrlErr from './err'

interface ICache<T> {
  // Basically, an object where all keys point to a value of the same type
  [key: string]: T
}

class Cacher<T> {
  constructor (private cache: ICache<T>) {}
  define (key: string, val: T) {
    this.cache[key] = val
  }
  get (key: string) {
    // string | array.
    // TODO: allow array of keys to look down
    // TODO: create plugin to allow referencing helpers, filters with dot notation
    return this.cache[key]
  }
  remove (key: string) {
    delete this.cache[key]
  }
  clear () {
    this.cache = {}
  }
  load (cacheObj: ICache<T>) {
    this.cache = cacheObj
  }
}

export { Cacher }
