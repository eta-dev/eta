/* global it, expect, describe */

import { Cacher } from '../src/storage'

const Container = new Cacher<number>({ one: 1, two: 2 })

describe('Config Tests', () => {
  it('Cache.get works', () => {
    expect(Container.get('one')).toEqual(1)
  })

  it('Cache.define works', () => {
    Container.define('three', 3)
    expect(Container.get('three')).toEqual(3)
  })

  it('Cache.remove works', () => {
    Container.remove('one')
    expect(Container.get('one')).toEqual(undefined)
  })

  it('Cache.reset works', () => {
    Container.reset()
    expect(Container.get('two')).toEqual(undefined)
  })

  it('Cache.load works', () => {
    Container.reset()
    Container.load({ seven: 7, eight: 8 })
    expect(Container.get('eight')).toEqual(8)
  })
})
