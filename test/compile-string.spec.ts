/* global it, expect, describe */
import { compileToString, defaultConfig, getConfig } from '../src/index'

const fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.eta')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

describe('Compile to String test', () => {
  it('parses a simple template', () => {
    const str = compileToString('hi <%= hey %>', defaultConfig)
    expect(str)
      .toEqual(`var tR='',__l,__lP,include=E.include.bind(E),includeFile=E.includeFile.bind(E)
function layout(p,d){__l=p;__lP=d}
tR+='hi '
tR+=E.e(hey)
if(__l)tR=includeFile(__l,Object.assign(it,{body:tR},__lP))
if(cb){cb(null,tR)} return tR`)
  })

  it('parses a simple template without partial helpers defined', () => {
    const str = compileToString(
      'hi <%= hey %>',
      getConfig({ include: undefined, includeFile: undefined })
    )
    expect(str).toEqual(`var tR='',__l,__lP
function layout(p,d){__l=p;__lP=d}
tR+='hi '
tR+=E.e(hey)
if(cb){cb(null,tR)} return tR`)
  })

  it('parses a simple template with raw tag', () => {
    const str = compileToString('hi <%~ hey %>', defaultConfig)
    expect(str)
      .toEqual(`var tR='',__l,__lP,include=E.include.bind(E),includeFile=E.includeFile.bind(E)
function layout(p,d){__l=p;__lP=d}
tR+='hi '
tR+=hey
if(__l)tR=includeFile(__l,Object.assign(it,{body:tR},__lP))
if(cb){cb(null,tR)} return tR`)
  })

  it('works with whitespace trimming', () => {
    const str = compileToString('hi\n<%- = hey-%>\n<%_ = hi_%>', defaultConfig)
    expect(str)
      .toEqual(`var tR='',__l,__lP,include=E.include.bind(E),includeFile=E.includeFile.bind(E)
function layout(p,d){__l=p;__lP=d}
tR+='hi'
tR+=E.e(hey)
tR+=E.e(hi)
if(__l)tR=includeFile(__l,Object.assign(it,{body:tR},__lP))
if(cb){cb(null,tR)} return tR`)
  })

  it('compiles complex template', () => {
    const str = compileToString(complexTemplate, defaultConfig)
    expect(str).toEqual(
      `var tR='',__l,__lP,include=E.include.bind(E),includeFile=E.includeFile.bind(E)
function layout(p,d){__l=p;__lP=d}
tR+='Hi\\n'
console.log("Hope you like Eta!")
tR+=E.e(it.htmlstuff)
tR+='\\n'
for (var key in it.obj) {
tR+='Value: '
tR+=E.e(it.obj[key])
tR+=', Key: '
tR+=E.e(key)
tR+='\\n'
if (key === 'thirdchild') {
tR+='  '
for (var i = 0, arr = it.obj[key]; i < arr.length; i++) {
tR+='      Salutations! Index: '
tR+=E.e(i)
tR+=', parent key: '
tR+=E.e(key)
tR+='      \\n  '
}
}
}
tR+='\\nThis is a partial: '
tR+=include("mypartial")
if(__l)tR=includeFile(__l,Object.assign(it,{body:tR},__lP))
if(cb){cb(null,tR)} return tR`
    )
  })
})
