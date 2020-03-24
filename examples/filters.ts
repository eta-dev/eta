var Eta = require('../dist/eta.cjs')
// var template = `

// {{=it.value}}

// {{=it.value}}
// {{/*this is a comment */}}
// `

var template = '\n{{it.hi}}'

console.log(Eta.parse(template, Eta.defaultConfig))
console.log('===========================')
// console.log(Eta.compile(template, Eta.defaultConfig).toString())
// console.log('===========================')
// console.log(Eta.render(template, { value: '<img>Something</img>' }))
