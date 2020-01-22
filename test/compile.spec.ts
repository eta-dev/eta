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
    var str = Compile('hi {{ hey }}')
    expect(str).toBeTruthy()
  })

  it('works with whitespace trimming', () => {
    var str = Compile('hi {{-hey-}} {{_hi_}}')
    expect(str).toBeTruthy()
  })

  it('works with filters', () => {
    var str = Compile('hi {{ hey | stuff | stuff2 ("param1") }}')
    expect(str).toBeTruthy()
  })

  it('works with helpers', () => {
    var str = Compile('{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}')
    expect(str).toBeTruthy()
  })

  it('compiles complex template', () => {
    var str = Compile(complexTemplate)
    expect(str).toBeTruthy()
  })

  test('throws with bad filter syntax', () => {
    expect(() => {
      Compile('{{~hi () hey | hi /}}')
    }).toThrow()
  })

  it('works with self-closing helpers', () => {
    var str = Compile('{{~log ("hey") | hi /}}')
    expect(str).toBeTruthy()
  })

  it('works with helpers with results', () => {
    var str = Compile('{{~log ("hey") => res, res2}}{{/log}}')
    expect(str).toBeTruthy()
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      Compile('{{~each(x) => hi }} Hey {{#else }} oops {{/ if}}')
    }).toThrow()
  })

  // it('DummyClass is instantiable', () => {
  //   expect(new DummyClass()).toBeInstanceOf(DummyClass)
  // })
})
