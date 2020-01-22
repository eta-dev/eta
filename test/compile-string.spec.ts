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
    var str = CompileToString('hi {{ hey }}', Env.get('default'))
    expect(str).toEqual("var tR='';tR+='hi ';tR+=l('F','e')(hey);return tR")
  })

  it('works with whitespace trimming', () => {
    var str = CompileToString('hi {{-hey-}} {{_hi_}}', Env.get('default'))
    expect(str).toEqual("var tR='';tR+='hi';tR+=l('F','e')(hey);tR+=l('F','e')(hi);return tR")
  })

  it('works with filters', () => {
    var str = CompileToString('hi {{ hey | stuff | stuff2 ("param1") }}', Env.get('default'))
    expect(str).toEqual(
      "var tR='';tR+='hi ';tR+=l('F','stuff2')(l('F','stuff')(l('F','e')(hey)),\"param1\");return tR"
    )
  })

  it('works with helpers', () => {
    var str = CompileToString(
      '{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}',
      Env.get('default')
    )
    expect(str).toEqual(
      "var tR='';tR+=l('H','each')({exec:function(hi){var tR='';tR+=' Hey ';return tR},params:[x]},[{exec:function(){var tR='';tR+=' oops ';return tR},params:[],name:'else'},]);return tR"
    )
  })

  it('compiles complex template', () => {
    var str = CompileToString(complexTemplate, Env.get('default'))
    expect(str).toEqual(
      "var tR='';tR+='Hi\\n';tR+=l('H','log')(\"Hope you like Squirrelly!\");tR+='\\n';tR+=l('F','e')(htmlstuff);tR+='\\n';tR+=l('H','foreach')({exec:function(val, key){var tR='';tR+='\\n\\nReversed value: ';tR+=l('F','reverse')(l('F','e')(val));tR+=', Key: ';tR+=l('F','e')(key);tR+='\\n';if(key===\"thirdchild\"){tR+='\\n';tR+=l('H','each')({exec:function(index, key){var tR='';tR+='\\n\\nSalutations! Index: ';tR+=l('F','e')(index);tR+=', old key: ';tR+=l('F','e')(key);tR+='\\n';return tR},params:[options.obj[key]]},[]);tR+='\\n';}tR+='\\n';return tR},params:[options.obj]},[]);tR+='\\n\\n';tR+=l('H','customhelper')({exec:function(){var tR='';tR+='\\n';return tR},params:[]},[{exec:function(){var tR='';tR+='\\nCabbages taste good\\n';console.log(hi);tR+='\\n';tR+='\\n';return tR},params:[],name:'cabbage'},{exec:function(){var tR='';tR+='\\nAs do pineapples\\n';return tR},params:[],name:'pineapple'},]);tR+='\\n\\nThis is a partial: ';tR+=l('H','include')(\"mypartial\");return tR"
    )
  })

  test('throws with bad filter syntax', () => {
    expect(() => {
      CompileToString('{{~hi () hey | hi /}}', Env.get('default'))
    }).toThrow()
  })

  it('works with self-closing helpers', () => {
    var str = CompileToString('{{~log ("hey") | hi /}}', Env.get('default'))
    expect(str).toEqual("var tR='';tR+=l('F','hi')(l('H','log')(\"hey\"));return tR")
  })

  it('works with helpers with results', () => {
    var str = CompileToString('{{~log ("hey") => res, res2}}{{/log}}', Env.get('default'))
    expect(str).toEqual(
      "var tR='';tR+=l('H','log')({exec:function(res, res2){var tR='';return tR},params:[\"hey\"]},[]);return tR"
    )
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      CompileToString('{{~each(x) => hi }} Hey {{#else }} oops {{/ if}}', Env.get('default'))
    }).toThrow()
  })

  // it('DummyClass is instantiable', () => {
  //   expect(new DummyClass()).toBeInstanceOf(DummyClass)
  // })
})
