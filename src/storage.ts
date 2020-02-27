import { copyProps } from './utils'

/* TYPES */

interface Dict<T> {
  // Basically, an object where all keys point to a value of the same type
  [key: string]: T
}

/* END TYPES */

class Cacher<T> {
  constructor (private cache: Dict<T>) {}
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
  reset () {
    this.cache = {}
  }
  load (cacheObj: Dict<T>) {
    // TODO: this will err with deep objects and `storage` or `plugins` keys.
    // Update Feb 26: EDITED so it shouldn't err
    copyProps(this.cache, cacheObj, true)
  }
}

export { Cacher }
