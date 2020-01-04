var Sqrl = require('../dist/squirrelly.cjs')
var template = `
{{~try}}
This won't work: {{it.hi | validate}}
{{#catch => err}}
Uh-oh, error! Message was '{{err}} ''
{{/try}}
`
Sqrl.Filters.define('validate', function (str) {
  if (typeof str === 'undefined') {
    throw Error("str doesn't fit expected format")
  }
})

console.log(Sqrl.Parse(template, '{{', '}}'))
console.log('===========================')
console.log(Sqrl.Compile(template, '{{', '}}').toString())
console.log('===========================')
console.log(Sqrl.Render(template, { riceKids: ['Ben', 'Polly', 'Joel', 'Phronsie', 'Davie'] }))
