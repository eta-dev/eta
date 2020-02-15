import * as Sqrl from '../src/index'
import { HelperFunction } from '../src/containers'

function resolveAfter2Seconds () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('HI FROM ASYNC')
    }, 2000)
  })
}

async function asyncTest () {
  const result = await resolveAfter2Seconds()
  return result
}

// TODO: update HelperFunction to allow async funcs

Sqrl.helpers.define('async-test', (asyncTest as unknown) as HelperFunction)

describe('Async Render checks', () => {
  describe('Async works', () => {
    it('Simple template compiles asynchronously', async () => {
      expect(
        await Sqrl.render('Hi {{it.name}}', { name: 'Ada Lovelace' }, { async: true })
      ).toEqual('Hi Ada Lovelace')
    })
    it('Async helper works', async () => {
      expect(
        await Sqrl.render(
          '{{~async-test()/}}',
          { name: 'Ada Lovelace' },
          { async: true, asyncHelpers: ['async-test'] }
        )
      ).toEqual('HI FROM ASYNC')
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

      Sqrl.render(
        '{{~async-test()/}}',
        { name: 'Ada Lovelace' },
        { async: true, asyncHelpers: ['async-test'] },
        cb
      )
    })
  })
})
