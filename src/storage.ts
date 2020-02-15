/* TYPES */

interface ICache<T> {
  // Basically, an object where all keys point to a value of the same type
  [key: string]: T
}

/* END TYPES */

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
  reset () {
    this.cache = {}
  }
  load (cacheObj: ICache<T>) {
    for (var key in cacheObj) {
      if (cacheObj.hasOwnProperty(key)) {
        this.cache[key] = cacheObj[key]
      }
    }
  }
}

export { Cacher }
