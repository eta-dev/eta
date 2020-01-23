import { Parse } from '../src/index'
import { Env } from '../src/config'

var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.sqrl')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

/**
 * Dummy test
 */
describe('Parse test', () => {
  it('parses a simple template', () => {
    var buff = Parse('hi {{ hey }}', Env.default)
    expect(buff).toEqual(['hi ', { f: [], c: 'hey', t: 'r' }])
  })

  it('works with whitespace trimming', () => {
    var buff = Parse('hi {{-hey-}} {{_hi_}}', Env.default)
    expect(buff).toEqual(['hi', { f: [], c: 'hey', t: 'r' }, { f: [], c: 'hi', t: 'r' }])
  })

  it('works with filters', () => {
    var buff = Parse('hi {{ hey | stuff | stuff2 ("param1") }}', Env.default)
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
    var buff = Parse('{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}', Env.default)
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
    var buff = Parse(complexTemplate, Env.default)
    expect(buff).toEqual([
      'Hi\n',
      { f: [], n: 'log', p: '"Hope you like Squirrelly!"', t: 's' },
      '\n',
      { f: [], c: 'htmlstuff', t: 'r' },
      '\n',
      {
        f: [],
        n: 'foreach',
        p: 'options.obj',
        res: 'val, key',
        t: '~',
        b: [],
        d: [
          '\n\nReversed value: ',
          { f: [['reverse', '']], c: 'val', t: 'r' },
          ', Key: ',
          { f: [], c: 'key', t: 'r' },
          '\n',
          {
            f: [],
            n: 'if',
            p: 'key==="thirdchild"',
            t: '~',
            b: [],
            d: [
              '\n',
              {
                f: [],
                n: 'each',
                p: 'options.obj[key]',
                res: 'index, key',
                t: '~',
                b: [],
                d: [
                  '\n\nSalutations! Index: ',
                  { f: [], c: 'index', t: 'r' },
                  ', old key: ',
                  { f: [], c: 'key', t: 'r' },
                  '\n'
                ]
              },
              '\n'
            ]
          },
          '\n'
        ]
      },
      '\n\n',
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
              '\nCabbages taste good\n',
              { f: [], c: 'console.log(hi)', t: '!' },
              '\n',
              { f: [], c: 'custom stuff', t: '?' },
              '\n'
            ]
          },
          { f: [], n: 'pineapple', t: '#', d: ['\nAs do pineapples\n'] }
        ],
        d: ['\n']
      },
      '\n\nThis is a partial: ',
      { f: [], n: 'include', p: '"mypartial"', t: 's' }
    ])
  })

  test('throws with bad filter syntax', () => {
    expect(() => {
      Parse('{{~hi () hey | hi /}}', Env.default)
    }).toThrow()
  })

  test('throws with unclosed tag', () => {
    expect(() => {
      Parse('{{hi("hey")', Env.default)
    }).toThrow()
  })

  it('works with self-closing helpers', () => {
    var buff = Parse('{{~log ("hey") | hi /}}', Env.default)
    expect(buff).toEqual([{ f: [['hi', '']], n: 'log', p: '"hey"', t: 's' }])
  })

  it('works with helpers with results', () => {
    var buff = Parse('{{~log ("hey") => res, res2}}{{/log}}', Env.default)
    expect(buff).toEqual([{ f: [], n: 'log', p: '"hey"', res: 'res, res2', t: '~', b: [], d: [] }])
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      Parse('{{~each(x) => hi }} Hey {{#else }} oops {{/ if}}', Env.default)
    }).toThrow()
  })
})
