/* global it, expect, describe */

import { parse } from '../src/index'
import { defaultConfig } from '../src/config'

var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.eta')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

/**
 * Dummy test
 */
describe('parse test', () => {
  it('parses a simple template', () => {
    var buff = parse('hi <%= hey %>', defaultConfig)
    expect(buff).toEqual(['hi ', { val: 'hey', t: 'i' }])
  })

  it('works with whitespace trimming', () => {
    var buff = parse('hi\n<%- = hey-%> <%_ = hi _%>', defaultConfig)
    expect(buff).toEqual(['hi', { val: 'hey', t: 'i' }, { val: 'hi', t: 'i' }])
  })

  it('compiles complex template', () => {
    var buff = parse(complexTemplate, defaultConfig)
    expect(buff).toEqual([
      'Hi\\n',
      { t: 'e', val: 'console.log("Hope you like Eta!")' },
      { t: 'i', val: 'it.htmlstuff' },
      '\\n',
      { t: 'e', val: 'for (var key in it.obj) {' },
      'Value: ',
      { t: 'i', val: 'it.obj[key]' },
      ', Key: ',
      { t: 'i', val: 'key' },
      '\\n',
      { t: 'e', val: "if (key === 'thirdchild') {" },
      '  ',
      {
        t: 'e',
        val: 'for (var i = 0, arr = it.obj[key]; i < arr.length; i++) {'
      },
      '      Salutations! Index: ',
      { t: 'i', val: 'i' },
      ', parent key: ',
      { t: 'i', val: 'key' },
      '      \\n  ',
      { t: 'e', val: '}' },
      { t: 'e', val: '}' },
      { t: 'e', val: '}' },
      '\\nThis is a partial: ',
      { t: 'i', val: 'E.include("mypartial")' }
    ])
  })

  // TODO: Add errs here

  // test('throws with unclosed tag', () => {
  //   expect(() => {
  //     parse('<%hi("hey")', defaultConfig)
  //   }).toThrow()
  // })
})
