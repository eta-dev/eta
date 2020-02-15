import { compile } from '../src/index'
var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.sqrl')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

describe('Compile test', () => {
  it('parses a simple template', () => {
    var str = compile('hi {{ hey }}')
    expect(str).toBeTruthy()
  })

  it('parses a simple template when env name is passed', () => {
    var str = compile('hi {{ hey }}')
    expect(str).toBeTruthy()
  })

  it('works with whitespace trimming', () => {
    var str = compile('hi {{-hey-}} {{_hi_}}')
    expect(str).toBeTruthy()
  })

  it('works with filters', () => {
    var str = compile('hi {{ hey | stuff | stuff2 ("param1") }}')
    expect(str).toBeTruthy()
  })

  it('works with helpers', () => {
    var str = compile('{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}')
    expect(str).toBeTruthy()
  })

  it('compiles complex template', () => {
    var str = compile(complexTemplate)
    expect(str).toBeTruthy()
  })

  test('throws with bad filter syntax', () => {
    expect(() => {
      compile('{{~hi () hey | hi /}}')
    }).toThrow()
  })

  it('works with self-closing helpers', () => {
    var str = compile('{{~log ("hey") | hi /}}')
    expect(str).toBeTruthy()
  })

  it('works with helpers with results', () => {
    var str = compile('{{~log ("hey") => res, res2}}{{/log}}')
    expect(str).toBeTruthy()
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      compile('{{~each(x) => hi }} Hey {{#else }} oops {{/ if}}')
    }).toThrow()
  })
})
