import { CompileToString } from '../src/index'
var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.sqrl')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

/**
 * Dummy test
 */
describe('Compile to String test', () => {
  it('parses a simple template', () => {
    var str = CompileToString('hi {{ hey }}', '{{', '}}')
    expect(str).toMatch(/[^]+/)
  })

  it('works with whitespace trimming', () => {
    var str = CompileToString('hi {{-hey-}} {{_hi_}}', '{{', '}}')
    expect(str).toMatch(/[^]+/)
  })

  it('works with filters', () => {
    var str = CompileToString('hi {{ hey | stuff | stuff2 ("param1") }}', '{{', '}}')
    expect(str).toMatch(/[^]+/)
  })

  it('works with helpers', () => {
    var str = CompileToString('{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}', '{{', '}}')
    expect(str).toMatch(/[^]+/)
  })

  it('compiles complex template', () => {
    var str = CompileToString(complexTemplate, '{{', '}}')
    expect(str).toMatch(/[^]+/)
  })

  test('throws with bad filter syntax', () => {
    expect(() => {
      CompileToString('{{~hi () hey | hi /}}', '{{', '}}')
    }).toThrow()
  })

  it('works with self-closing helpers', () => {
    var str = CompileToString('{{~log ("hey") | hi /}}', '{{', '}}')
    expect(str).toMatch(/[^]+/)
  })

  it('works with helpers with results', () => {
    var str = CompileToString('{{~log ("hey") => res, res2}}{{/log}}', '{{', '}}')
    expect(str).toMatch(/[^]+/)
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      CompileToString('{{~each(x) => hi }} Hey {{#else }} oops {{/ if}}', '{{', '}}')
    }).toThrow()
  })

  // it('DummyClass is instantiable', () => {
  //   expect(new DummyClass()).toBeInstanceOf(DummyClass)
  // })
})
