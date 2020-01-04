import { CompileToString } from '../src/index'
import { Env } from '../src/config'
var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.sqrl')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

/**
 * Dummy test
 */
describe('Compile to String test', () => {
  it('parses a simple template', () => {
    var str = CompileToString('hi {{ hey }}', '{{', '}}', Env.get('default'))
    expect(str).toMatch(/[^]+/)
  })

  it('works with whitespace trimming', () => {
    var str = CompileToString('hi {{-hey-}} {{_hi_}}', '{{', '}}', Env.get('default'))
    expect(str).toMatch(/[^]+/)
  })

  it('works with filters', () => {
    var str = CompileToString(
      'hi {{ hey | stuff | stuff2 ("param1") }}',
      '{{',
      '}}',
      Env.get('default')
    )
    expect(str).toMatch(/[^]+/)
  })

  it('works with helpers', () => {
    var str = CompileToString(
      '{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}',
      '{{',
      '}}',
      Env.get('default')
    )
    expect(str).toMatch(/[^]+/)
  })

  it('compiles complex template', () => {
    var str = CompileToString(complexTemplate, '{{', '}}', Env.get('default'))
    expect(str).toMatch(/[^]+/)
  })

  test('throws with bad filter syntax', () => {
    expect(() => {
      CompileToString('{{~hi () hey | hi /}}', '{{', '}}', Env.get('default'))
    }).toThrow()
  })

  it('works with self-closing helpers', () => {
    var str = CompileToString('{{~log ("hey") | hi /}}', '{{', '}}', Env.get('default'))
    expect(str).toMatch(/[^]+/)
  })

  it('works with helpers with results', () => {
    var str = CompileToString(
      '{{~log ("hey") => res, res2}}{{/log}}',
      '{{',
      '}}',
      Env.get('default')
    )
    expect(str).toMatch(/[^]+/)
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      CompileToString(
        '{{~each(x) => hi }} Hey {{#else }} oops {{/ if}}',
        '{{',
        '}}',
        Env.get('default')
      )
    }).toThrow()
  })

  // it('DummyClass is instantiable', () => {
  //   expect(new DummyClass()).toBeInstanceOf(DummyClass)
  // })
})
