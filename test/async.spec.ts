/* global it, expect, describe */

import * as Eta from '../src/index'
import { buildRegEx } from './err.spec'

function resolveAfter2Seconds(val: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val)
    }, 20)
  })
}

async function asyncTest() {
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

    it('Simple template compiles asynchronously with callback', (done) => {
      function cb(_err: Error | null, res?: string) {
        expect(res).toEqual(res)
        done()
      }
      Eta.render('Hi <%= it.name %>', { name: 'Ada Lovelace' }, { async: true }, cb)
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

    it('Async template w/ syntax error throws', async () => {
      await expect(async () => {
        await Eta.render('<%= @#$%^ %>', {}, { async: true })
      }).rejects.toThrow(
        buildRegEx(`
var tR='',__l,__lP,include=E.include.bind(E),includeFile=E.includeFile.bind(E)
function layout(p,d){__l=p;__lP=d}
tR+=E.e(@#$%^)
if(__l)tR=await includeFile(__l,Object.assign(it,{body:tR},__lP))
if(cb){cb(null,tR)} return tR
`)
      )
    })

    it('Async template w/ syntax error passes error to callback', (done) => {
      function cb(err: Error | null, _res?: string) {
        expect(err).toBeTruthy()
        expect((err as Error).message).toMatch(
          buildRegEx(`
var tR='',__l,__lP,include=E.include.bind(E),includeFile=E.includeFile.bind(E)
function layout(p,d){__l=p;__lP=d}
tR+=E.e(@#$%^)
if(__l)tR=await includeFile(__l,Object.assign(it,{body:tR},__lP))
if(cb){cb(null,tR)} return tR
`)
        )
        done()
      }

      Eta.render('<%= @#$%^ %>', {}, { name: 'Ada Lovelace', async: true }, cb)
    })
  })
})

describe('Async Loops', () => {
  // TODO
})
