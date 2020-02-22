/* global it, expect, describe */

import { parse } from '../src/index'
import { defaultConfig } from '../src/config'

var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.sqrl')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

/**
 * Dummy test
 */
describe('parse test', () => {
  it('parses a simple template', () => {
    var buff = parse('hi {{ hey }}', defaultConfig)
    expect(buff).toEqual(['hi ', { f: [], c: 'hey', t: 'r' }])
  })

  it('works with whitespace trimming', () => {
    var buff = parse('hi\n{{-hey-}} {{_hi_}}', defaultConfig)
    expect(buff).toEqual(['hi', { f: [], c: 'hey', t: 'r' }, { f: [], c: 'hi', t: 'r' }])
  })

  it('works with filters', () => {
    var buff = parse('hi {{ hey | stuff | stuff2 ("param1") }}', defaultConfig)
    expect(buff).toEqual([
      'hi ',
      {
        f: [
          ['stuff', ''],
          ['stuff2', '"param1"']
        ],
        c: 'hey',
        t: 'r'
      }
    ])
  })

  it('works with helpers', () => {
    var buff = parse('{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}', defaultConfig)
    expect(buff).toEqual([
      {
        f: [],
        n: 'each',
        p: 'x',
        res: 'hi',
        t: '~',
        b: [{ f: [], n: 'else', t: '#', d: [' oops '] }],
        d: [' Hey ']
      }
    ])
  })

  it('compiles complex template', () => {
    var buff = parse(complexTemplate, defaultConfig)
    expect(buff).toEqual([
      'Hi\n',
      { f: [], n: 'log', p: '"Hope you like Squirrelly!"', t: 's' },
      { f: [], c: 'htmlstuff', t: 'r' },
      {
        f: [],
        n: 'foreach',
        p: 'options.obj',
        res: 'val, key',
        t: '~',
        b: [],
        d: [
          '\nReversed value: ',
          { f: [['reverse', '']], c: 'val', t: 'r' },
          ', Key: ',
          { f: [], c: 'key', t: 'r' },
          {
            f: [],
            n: 'if',
            p: 'key==="thirdchild"',
            t: '~',
            b: [],
            d: [
              {
                f: [],
                n: 'each',
                p: 'options.obj[key]',
                res: 'index, key',
                t: '~',
                b: [],
                d: [
                  '\nSalutations! Index: ',
                  { f: [], c: 'index', t: 'r' },
                  ', old key: ',
                  { f: [], c: 'key', t: 'r' }
                ]
              }
            ]
          }
        ]
      },
      '\n',
      {
        f: [],
        n: 'customhelper',
        p: '',
        t: '~',
        b: [
          {
            f: [],
            n: 'cabbage',
            t: '#',
            d: [
              'Cabbages taste good\n',
              { f: [], c: 'console.log(hi)', t: '!' },
              { f: [], c: 'custom stuff', t: '?' }
            ]
          },
          { f: [], n: 'pineapple', t: '#', d: ['As do pineapples\n'] }
        ],
        d: []
      },
      '\nThis is a partial: ',
      { f: [], n: 'include', p: '"mypartial"', t: 's' }
    ])
  })

  test('throws with bad filter syntax', () => {
    expect(() => {
      parse('{{~hi () hey | hi /}}', defaultConfig)
    }).toThrow()
  })

  test('throws with unclosed tag', () => {
    expect(() => {
      parse('{{hi("hey")', defaultConfig)
    }).toThrow()
  })

  it('works with self-closing helpers', () => {
    var buff = parse('{{~log ("hey") | hi /}}', defaultConfig)
    expect(buff).toEqual([{ f: [['hi', '']], n: 'log', p: '"hey"', t: 's' }])
  })

  it('works with helpers with results', () => {
    var buff = parse('{{~log ("hey") => res, res2}}{{/log}}', defaultConfig)
    expect(buff).toEqual([{ f: [], n: 'log', p: '"hey"', res: 'res, res2', t: '~', b: [], d: [] }])
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      parse('{{~each(x) => hi }} Hey {{#else }} oops {{/ if}}', defaultConfig)
    }).toThrow()
  })
})
