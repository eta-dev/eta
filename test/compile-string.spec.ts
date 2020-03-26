/* global it, expect, describe */
import { compileToString } from '../src/index'
import { defaultConfig } from '../src/config'

var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.eta')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

/**
 * Dummy test
 */
describe('Compile to String test', () => {
  it('parses a simple template', () => {
    var str = compileToString('hi <%= hey %>', defaultConfig)
    expect(str).toEqual("var tR='';tR+='hi ';tR+=E.e(hey);if(cb){cb(null,tR)} return tR")
  })

  it('works with whitespace trimming', () => {
    var str = compileToString('hi\n<%- = hey-%>\n<%_ = hi_%>', defaultConfig)
    expect(str).toEqual("var tR='';tR+='hi';tR+=E.e(hey);tR+=E.e(hi);if(cb){cb(null,tR)} return tR")
  })

  it('compiles complex template', () => {
    var str = compileToString(complexTemplate, defaultConfig)
    expect(str).toEqual(
      `var tR='';tR+='Hi\\n';console.log("Hope you like Eta!")
tR+=E.e(it.htmlstuff);tR+='\\n';for (var key in it.obj) {
tR+='Value: ';tR+=E.e(it.obj[key]);tR+=', Key: ';tR+=E.e(key);tR+='\\n';if (key === 'thirdchild') {
tR+='  ';for (var i = 0, arr = it.obj[key]; i < arr.length; i++) {
tR+='      Salutations! Index: ';tR+=E.e(i);tR+=', parent key: ';tR+=E.e(key);tR+='      \\n  ';}
}
}
tR+='\\nThis is a partial: ';tR+=E.e(E.include("mypartial"));if(cb){cb(null,tR)} return tR`
    )
  })
})
