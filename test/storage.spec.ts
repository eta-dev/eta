import { Cacher } from '../src/storage'

var Container = new Cacher<number>({ one: 1, two: 2 })

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

  it('Cache.clear works', () => {
    Container.clear()
    expect(Container.get('two')).toEqual(undefined)
  })

  it('Cache.load works', () => {
    Container.clear()
    Container.load({ seven: 7, eight: 8 })
    expect(Container.get('eight')).toEqual(8)
  })
})
