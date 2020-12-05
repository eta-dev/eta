/* global it, expect, describe */

import { compile } from '../src/index'
import { buildRegEx } from './err.spec'

const fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.eta')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

describe('Compile test', () => {
  it('parses a simple template', () => {
    const str = compile('hi <%= hey %>')
    expect(str).toBeTruthy()
  })

  it('works with plain string templates', () => {
    const str = compile('hi this is a template')
    expect(str).toBeTruthy()
  })

  // TODO: Update
  it('compiles complex template', () => {
    const str = compile(complexTemplate)
    expect(str).toBeTruthy()
  })

  test('throws with bad inner JS syntax', () => {
    expect(() => {
      compile('<% hi (=h) %>')
    }).toThrow(
      buildRegEx(`
var tR='',__l,__lP,include=E.include.bind(E),includeFile=E.includeFile.bind(E)
function layout(p,d){__l=p;__lP=d}
hi (=h)
if(__l)tR=includeFile(__l,Object.assign(it,{body:tR},__lP))
if(cb){cb(null,tR)} return tR
`)
    )
  })
})
