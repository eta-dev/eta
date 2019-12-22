import { Compile } from '../src/index'
var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.sqrl')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

/**
 * Dummy test
 */
describe('Compile test', () => {
  it('parses a simple template', () => {
    var str = Compile('hi {{ hey }}', '{{', '}}').toString()
    expect(str).toMatch(/[^]+/)
  })

  it('works with whitespace trimming', () => {
    var str = Compile('hi {{-hey-}} {{_hi_}}', '{{', '}}').toString()
    expect(str).toMatch(/[^]+/)
  })

  it('works with filters', () => {
    var str = Compile('hi {{ hey | stuff | stuff2 ("param1") }}', '{{', '}}').toString()
    expect(str).toMatch(/[^]+/)
  })

  it('works with helpers', () => {
    var str = Compile('{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}', '{{', '}}').toString()
    expect(str).toMatch(/[^]+/)
  })

  it('compiles complex template', () => {
    var str = Compile(complexTemplate, '{{', '}}').toString()
    expect(str).toMatch(/[^]+/)
  })

  test('throws with bad filter syntax', () => {
    expect(() => {
      Compile('{{~hi () hey | hi /}}', '{{', '}}').toString()
    }).toThrow()
  })

  it('works with self-closing helpers', () => {
    var str = Compile('{{~log ("hey") | hi /}}', '{{', '}}').toString()
    expect(str).toMatch(/[^]+/)
  })

  it('works with helpers with results', () => {
    var str = Compile('{{~log ("hey") => res, res2}}{{/log}}', '{{', '}}').toString()
    expect(str).toMatch(/[^]+/)
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      Compile('{{~each(x) => hi }} Hey {{#else }} oops {{/ if}}', '{{', '}}').toString()
    }).toThrow()
  })

  // it('DummyClass is instantiable', () => {
  //   expect(new DummyClass()).toBeInstanceOf(DummyClass)
  // })
})
