import { Parse } from '../src/index'
var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.sqrl')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

/**
 * Dummy test
 */
describe('Parse test', () => {
  it('parses a simple template', () => {
    var buff = Parse('hi {{ hey }}', '{{', '}}')
    expect(buff).toBeTruthy()
  })

  it('works with whitespace trimming', () => {
    var buff = Parse('hi {{-hey-}} {{_hi_}}', '{{', '}}')
    expect(buff).toBeTruthy()
  })

  it('works with filters', () => {
    var buff = Parse('hi {{ hey | stuff | stuff2 ("param1") }}', '{{', '}}')
    expect(buff).toBeTruthy()
  })

  it('works with helpers', () => {
    var buff = Parse('{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}', '{{', '}}')
    expect(buff).toBeTruthy()
  })

  it('compiles complex template', () => {
    var buff = Parse(complexTemplate, '{{', '}}')
    expect(buff).toBeTruthy()
  })

  test('throws with bad filter syntax', () => {
    expect(() => {
      Parse('{{~hi () hey | hi /}}', '{{', '}}')
    }).toThrow()
  })

  test('throws with unclosed tag', () => {
    expect(() => {
      Parse('{{hi("hey")', '{{', '}}')
    }).toThrow()
  })

  it('works with self-closing helpers', () => {
    var buff = Parse('{{~log ("hey") | hi /}}', '{{', '}}')
    expect(buff).toBeTruthy()
  })

  it('works with helpers with results', () => {
    var buff = Parse('{{~log ("hey") => res, res2}}{{/log}}', '{{', '}}')
    expect(buff).toBeTruthy()
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      Parse('{{~each(x) => hi }} Hey {{#else }} oops {{/ if}}', '{{', '}}')
    }).toThrow()
  })

  // it('DummyClass is instantiable', () => {
  //   expect(new DummyClass()).toBeInstanceOf(DummyClass)
  // })
})
