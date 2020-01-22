var Sqrl = require('../dist/squirrelly.cjs')
var template = `
The Daugherty's have 8 kids. Their names are:
{{~each (it.riceKids) => val, index}}
{{~if(index < it.riceKids.length - 1_}}
  {{val}},
{{_#else_}}
  and {{val}}
{{_/if}}
{{_/each}}
`
Sqrl.Filters.define('capitalize', function (str) {
  return str.toUpperCase()
})

console.log(Sqrl.Parse(template, Sqrl.Env.get('default')))
console.log('===========================')
console.log(Sqrl.Compile(template, Sqrl.Env.get('default')).toString())
console.log('===========================')
console.log(Sqrl.Render(template, { riceKids: ['Ben', 'Polly', 'Joel', 'Phronsie', 'Davie'] }))
