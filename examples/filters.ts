var Sqrl = require('../dist/squirrelly.cjs')
var template = `
{{it.value}}

{{it.value | safe}}
{{!/*this is a comment */}}
{{it.value | safe | capitalize}}

{{it.value | capitalize | safe}}

`
Sqrl.Filters.define('capitalize', function (str) {
  return str.toUpperCase()
})

console.log(Sqrl.Parse(template, '{{', '}}'))
console.log('===========================')
console.log(Sqrl.Compile(template, '{{', '}}').toString())
console.log('===========================')
console.log(Sqrl.Render(template, { value: '<img>Something</img>' }))
