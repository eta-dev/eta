/* global it, expect, describe */

import { parse } from '../src/index'
import { config } from '../src/config'

const fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.eta')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

describe('parse test', () => {
  it('parses a simple template', () => {
    const buff = parse('hi <%= hey %>', config)
    expect(buff).toEqual(['hi ', { val: 'hey', t: 'i' }])
  })

  it('parses a raw tag', () => {
    const buff = parse('hi <%~ hey %>', config)
    expect(buff).toEqual(['hi ', { val: 'hey', t: 'r' }])
  })

  it('works with whitespace trimming', () => {
    const buff = parse('hi\n<%- = hey-%> <%_ = hi _%>', config)
    expect(buff).toEqual(['hi', { val: 'hey', t: 'i' }, { val: 'hi', t: 'i' }])
  })

  it('works with multiline comments', () => {
    const buff = parse('hi <% /* comment contains delimiter %> */ %>', config)
    expect(buff).toEqual(['hi ', { val: '/* comment contains delimiter %> */', t: 'e' }])
  })

  it('parses with simple template literal', () => {
    const buff = parse('hi <%= `template %> ${value}` %>', config)
    expect(buff).toEqual(['hi ', { val: '`template %> ${value}`', t: 'i' }])
  })

  it('compiles complex template', () => {
    const buff = parse(complexTemplate, config)
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
      { t: 'r', val: 'include("mypartial")' }
    ])
  })

  test('throws with unclosed tag', () => {
    expect(() => {
      parse('<%hi("hey")', config)
    }).toThrowError('hi')
  })

  test('throws with unclosed single-quote string', () => {
    expect(() => {
      parse("<%= ' %>", config)
    }).toThrowError(`unclosed string at line 1 col 5:

  <%= ' %>
      ^`)
  })

  test('throws with unclosed double-quote string', () => {
    expect(() => {
      parse('<%= " %>', config)
    }).toThrowError(`unclosed string at line 1 col 5:

  <%= " %>
      ^`)
  })

  test('throws with unclosed template literal', () => {
    expect(() => {
      parse('<%= ` %>', config)
    }).toThrowError(`unclosed string at line 1 col 5:

  <%= \` %>
      ^`)
  })

  test('throws with unclosed multi-line comment', () => {
    expect(() => {
      parse('<%= /* %>', config)
    }).toThrowError(`unclosed comment at line 1 col 5:

  <%= /* %>
      ^`)
  })
})
