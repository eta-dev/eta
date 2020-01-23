var Sqrl = require('../dist/squirrelly.cjs')
var template = `
{{~try}}
This won't work: {{ *it.hi | validate}}
{{#catch => err}}
Uh-oh, error! Message was '{{err.message}}'
{{/try}}
`

// the above is autoescaped because otherwise it automatically converts it to a string

Sqrl.Filters.define('validate', function (str) {
  console.log('str is ' + str + 'and its type is ' + typeof str)
  if (typeof str !== 'string') {
    console.log('gonna error')
    throw new Error('str does not fit expected format')
  } else {
    return str
  }
})

console.log(Sqrl.Parse(template, Sqrl.Env.default))
console.log('===========================')
console.log(Sqrl.Compile(template, Sqrl.Env.default).toString())
console.log('===========================')
console.log(Sqrl.Render(template, { riceKids: ['Ben', 'Polly', 'Joel', 'Phronsie', 'Davie'] }))
