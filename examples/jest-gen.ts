var Sqrl = require('../dist/squirrelly.cjs')

var str = Sqrl.CompileToString(
  '{{~each(x) => hi }} Hey {{#else }} oops {{/ each}}',
  Sqrl.Env.get('default')
)
console.log(str)
