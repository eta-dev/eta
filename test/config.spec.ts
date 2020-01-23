import { Render } from '../src/index'
import { Env, Config } from '../src/config'

describe('Config Tests', () => {
  it('Renders a simple template', () => {
    var buff = Render('hi {{ hey }}', 'default')
    expect(buff).toEqual(['hi ', { f: [], c: 'hey', t: 'r' }])
  })

  it('works with whitespace trimming', () => {
    var buff = Render('hi {{-hey-}} {{_hi_}}', Env.default)
    expect(buff).toEqual(['hi', { f: [], c: 'hey', t: 'r' }, { f: [], c: 'hi', t: 'r' }])
  })

  it('works with filters', () => {
    var buff = Render('hi {{ hey | stuff | stuff2 ("param1") }}', Env.default)
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
    var buff = Render('{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}', Env.default)
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

  test('throws with bad filter syntax', () => {
    expect(() => {
      Render('{{~hi () hey | hi /}}', Env.default)
    }).toThrow()
  })

  test('throws with unclosed tag', () => {
    expect(() => {
      Render('{{hi("hey")', Env.default)
    }).toThrow()
  })

  it('works with self-closing helpers', () => {
    var buff = Render('{{~log ("hey") | hi /}}', Env.default)
    expect(buff).toEqual([{ f: [['hi', '']], n: 'log', p: '"hey"', t: 's' }])
  })

  it('works with helpers with results', () => {
    var buff = Render('{{~log ("hey") => res, res2}}{{/log}}', Env.default)
    expect(buff).toEqual([{ f: [], n: 'log', p: '"hey"', res: 'res, res2', t: '~', b: [], d: [] }])
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      Render('{{~each(x) => hi }} Hey {{#else }} oops {{/ if}}', Env.default)
    }).toThrow()
  })
})
