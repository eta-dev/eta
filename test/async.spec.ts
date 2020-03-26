/* global it, expect, describe */

import * as Eta from '../src/index'

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

describe('Async Render checks', () => {
  describe('Async works', () => {
    it('Simple template compiles asynchronously', async () => {
      expect(
        await Eta.render('Hi <%= it.name %>', { name: 'Ada Lovelace' }, { async: true })
      ).toEqual('Hi Ada Lovelace')
    })
    it('Async function works', async () => {
      expect(
        await Eta.render(
          '<%= await it.asyncTest() %>',
          { name: 'Ada Lovelace', asyncTest: asyncTest },
          { async: true }
        )
      ).toEqual('HI FROM ASYNC')
    })
  })
})

describe('Async Loops', () => {
  // TODO
})
