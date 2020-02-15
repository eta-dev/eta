import { compileToString } from '../src/index'
import { defaultConfig } from '../src/config'
var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.sqrl')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

/**
 * Dummy test
 */
describe('Compile to String test', () => {
  it('parses a simple template', () => {
    var str = compileToString('hi {{ hey }}', defaultConfig)
    expect(str).toEqual(
      "var tR='';tR+='hi ';tR+=c.l('F','e')(hey);if(cb){return cb(null,tR)} return tR"
    )
  })

  it('works with whitespace trimming', () => {
    var str = compileToString('hi\n{{-hey-}}\n{{_hi_}}', defaultConfig)
    expect(str).toEqual(
      "var tR='';tR+='hi';tR+=c.l('F','e')(hey);tR+=c.l('F','e')(hi);if(cb){return cb(null,tR)} return tR"
    )
  })

  it('works with filters', () => {
    var str = compileToString('hi {{ hey | stuff | stuff2 ("param1") }}', defaultConfig)
    expect(str).toEqual(
      "var tR='';tR+='hi ';tR+=c.l('F','stuff2')(c.l('F','stuff')(c.l('F','e')(hey)),\"param1\");if(cb){return cb(null,tR)} return tR"
    )
  })

  it('works with helpers', () => {
    var str = compileToString('{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}', defaultConfig)
    expect(str).toEqual(
      "var tR='';tR+=c.l('H','each')({exec:function(hi){var tR='';tR+=' Hey ';return tR},params:[x]},[{exec:function(){var tR='';tR+=' oops ';return tR},params:[],name:'else'},],c);if(cb){return cb(null,tR)} return tR"
    )
  })

  it('compiles complex template', () => {
    var str = compileToString(complexTemplate, defaultConfig)
    expect(str).toEqual(
      "var tR='';tR+='Hi\\n';tR+=c.l('H','log')({params:[\"Hope you like Squirrelly!\"]},[],c);tR+=c.l('F','e')(htmlstuff);tR+=c.l('H','foreach')({exec:function(val, key){var tR='';tR+='\\nReversed value: ';tR+=c.l('F','reverse')(c.l('F','e')(val));tR+=', Key: ';tR+=c.l('F','e')(key);if(key===\"thirdchild\"){tR+=c.l('H','each')({exec:function(index, key){var tR='';tR+='\\nSalutations! Index: ';tR+=c.l('F','e')(index);tR+=', old key: ';tR+=c.l('F','e')(key);return tR},params:[options.obj[key]]},[],c);}return tR},params:[options.obj]},[],c);tR+='\\n';tR+=c.l('H','customhelper')({exec:function(){var tR='';return tR},params:[]},[{exec:function(){var tR='';tR+='Cabbages taste good\\n';console.log(hi);return tR},params:[],name:'cabbage'},{exec:function(){var tR='';tR+='As do pineapples\\n';return tR},params:[],name:'pineapple'},],c);tR+='\\nThis is a partial: ';tR+=c.l('H','include')({params:[\"mypartial\"]},[],c);if(cb){return cb(null,tR)} return tR"
    )
  })

  test('throws with bad filter syntax', () => {
    expect(() => {
      compileToString('{{~hi () hey | hi /}}', defaultConfig)
    }).toThrow()
  })

  it('works with self-closing helpers', () => {
    var str = compileToString('{{~log ("hey") | hi /}}', defaultConfig)
    expect(str).toEqual(
      "var tR='';tR+=c.l('F','hi')(c.l('H','log')({params:[\"hey\"]},[],c));if(cb){return cb(null,tR)} return tR"
    )
  })

  it('works with helpers with results', () => {
    var str = compileToString('{{~log ("hey") => res, res2}}{{/log}}', defaultConfig)
    expect(str).toEqual(
      "var tR='';tR+=c.l('H','log')({exec:function(res, res2){var tR='';return tR},params:[\"hey\"]},[],c);if(cb){return cb(null,tR)} return tR"
    )
  })

  test("throws when helpers start and end don't match", () => {
    expect(() => {
      compileToString('{{~each(x) => hi }} Hey {{#else }} oops {{/ if}}', defaultConfig)
    }).toThrow()
  })
})
