/* global it, expect, describe */

import * as Sqrl from '../src/index'

function resolveAfter2Seconds (val: string): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(val)
    }, 20)
  })
}

async function asyncTest () {
  const result = await resolveAfter2Seconds('HI FROM ASYNC')
  return result
}

async function asyncFilter (val: string) {
  const result = await resolveAfter2Seconds(val.toUpperCase())
  return result
}

Sqrl.filters.define('upper', asyncFilter)

// TODO: update HelperFunction to allow async funcs

Sqrl.helpers.define('async-test', asyncTest)

describe('Async Render checks', () => {
  describe('Async works', () => {
    it('Simple template compiles asynchronously', async () => {
      expect(
        await Sqrl.render('Hi {{it.name}}', { name: 'Ada Lovelace' }, { async: true })
      ).toEqual('Hi Ada Lovelace')
    })
    it('Async helper works', async () => {
      expect(
        await Sqrl.render('{{~async async-test()/}}', { name: 'Ada Lovelace' }, { async: true })
      ).toEqual('HI FROM ASYNC')
    })

    it('Async filter works', async () => {
      expect(
        await Sqrl.render('{{it.val | async upper}}', { val: 'lowercase' }, { async: true })
      ).toEqual('LOWERCASE')
    })

    it('Async helper works with callback', done => {
      function cb (err: Error | null, res?: string) {
        try {
          expect(res).toBe('HI FROM ASYNC')
          done()
        } catch (error) {
          done(error)
        }
      }

      Sqrl.render('{{~async async-test()/}}', { name: 'Ada Lovelace' }, { async: true }, cb)
    })
  })

  describe('Async works', () => {
    test('throws if async filters in non-async env', () => {
      expect(() => {
        Sqrl.compile('{{it.val | async upper}}')
      }).toThrow()
    })

    test('throws if async helpers in non-async env', () => {
      expect(() => {
        Sqrl.compile('{{~async async-test()/}}')
      }).toThrow()
    })
  })
})

describe('Async Loops', () => {
  it('Looping over async array', async () => {
    var asyncLoopTemplate = `
{{~async each([1,2,3])}}
{{~async async-test() /}},
{{/each}}`
    expect(await Sqrl.render(asyncLoopTemplate, {}, { async: true })).toEqual(
      'HI FROM ASYNC,\nHI FROM ASYNC,\nHI FROM ASYNC,\n'
    )
  })

  it('Looping over object', async () => {
    var asyncLoopTemplate = `
{{~async foreach(it) => key, val}}
{{~async async-test() /}},{{key}},{{val}}

{{/foreach}}`
    expect(
      await Sqrl.render(asyncLoopTemplate, { key1: 'prop1', key2: 'prop2' }, { async: true })
    ).toEqual('HI FROM ASYNC,key1,prop1\nHI FROM ASYNC,key2,prop2\n')
  })
})
