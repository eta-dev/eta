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
    var buff = Parse('hi {{ hey }}', Env.get('default'))
    expect(buff).toBeTruthy()
  })

  it('works with whitespace trimming', () => {
    var buff = Parse('hi {{-hey-}} {{_hi_}}', Env.get('default'))
    expect(buff).toBeTruthy()
  })

  it('works with filters', () => {
    var buff = Parse('hi {{ hey | stuff | stuff2 ("param1") }}', Env.get('default'))
    expect(buff).toBeTruthy()
  })

  it('works with helpers', () => {
    var buff = Parse('{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}', Env.get('default'))
    expect(buff).toBeTruthy()
  })

  it('compiles complex template', () => {
    var buff = Parse(complexTemplate, Env.get('default'))
    expect(buff).toBeTruthy()
  })

  test('throws with bad filter syntax', () => {
    expect(() => {
      Parse('{{~hi () hey | hi /}}', Env.get('default'))
    }).toThrow()
  })

  test('throws with unclosed tag', () => {
    expect(() => {
      Parse('{{hi("hey")', Env.get('default'))
    }).toThrow()
  })

  it('works with self-closing helpers', () => {
    var buff = Parse('{{~log ("hey") | hi /}}', Env.get('default'))
    expect(buff).toBeTruthy()
  })

  it('works with helpers with results', () => {
    var buff = Parse('{{~log ("hey") => res, res2}}{{/log}}', Env.get('default'))
    expect(buff).toBeTruthy()
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      Parse('{{~each(x) => hi }} Hey {{#else }} oops {{/ if}}', Env.get('default'))
    }).toThrow()
  })

  // it('DummyClass is instantiable', () => {
  //   expect(new DummyClass()).toBeInstanceOf(DummyClass)
  // })
})
