import { Render, Filters } from '../src/index'

var eachTemplate = `
The Daugherty's have 8 kids. Their names are:
{{~each (it.kids) => val, index}}
{{~if(index < it.kids.length - 1_}}
  {{val}},
{{_#else_}}
  and {{val}}
{{_/if}}
{{_/each}}
`

describe('Helper tests', () => {
  it('parses a simple helper: each and if', () => {
    var res = Render(eachTemplate, { kids: ['Ben', 'Polly', 'Joel', 'Phronsie', 'Davie'] })
    expect(res).toEqual(`
The Daugherty's have 8 kids. Their names are:

Ben,
Polly,
Joel,
Phronsie,
and Davie
`)
  })

  var forEachTemplate = `
{{~foreach (it.numbers) => key, val}}
Key: {{key}}, Val: {{val}}
{{_/foreach}}
`

  it('parses a simple helper: foreach', () => {
    var res = Render(forEachTemplate, { numbers: { one: 1, two: 2 } })
    console.log('RES ===========')
    console.log('"' + res + '"')
    expect(res).toEqual(`

Key: one, Val: 1
Key: two, Val: 2
`)
  })

  var tryCatchTemplate = `
{{~try}}
This won't work: {{ *it.hi | validate}}
{{#catch => err}}
Uh-oh, error! Message was '{{err.message}}'
{{/try}}
`

  // the above is autoescaped because otherwise it automatically converts it to a string

  Filters.define('validate', function (str: string) {
    console.log('str is ' + str + 'and its type is ' + typeof str)
    if (typeof str !== 'string') {
      console.log('gonna error')
      throw new Error('str does not fit expected format')
    } else {
      return str
    }
  })

  it('parses a simple helper: try', () => {
    var res = Render(tryCatchTemplate, { hi: false })
    expect(res).toEqual(`

This won't work: 
Uh-oh, error! Message was 'str does not fit expected format'

`)
  })
})
