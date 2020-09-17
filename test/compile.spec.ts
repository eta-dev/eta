/* global it, expect, describe */

import { compile } from '../src/index'
import { buildRegEx } from './err.spec'

var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.eta')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

describe('Compile test', () => {
  it('parses a simple template', () => {
    var str = compile('hi <%= hey %>')
    expect(str).toBeTruthy()
  })

  it('works with plain string templates', () => {
    var str = compile('hi this is a template')
    expect(str).toBeTruthy()
  })

  // TODO: Update
  it('compiles complex template', () => {
    var str = compile(complexTemplate)
    expect(str).toBeTruthy()
  })

  test('throws with bad inner JS syntax', () => {
    expect(() => {
      compile('<% hi (=h) %>')
    }).toThrow(
      buildRegEx(`
var tR='',__l,include=E.include.bind(E),includeFile=E.includeFile.bind(E)
function layout(p){__l=p}
hi (=h)
if(__l)tR=includeFile(__l,Object.assign(it,{body:tR}))
if(cb){cb(null,tR)} return tR
`)
    )
  })
})
