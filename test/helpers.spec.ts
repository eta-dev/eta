import { Render, Compile, Filters, Env, CompileToString } from '../src/index'

var eachTemplate = `
The Daugherty's have 8 kids. Their names are:

{{~each (it.kids) => val, index}}
{{~if(index < it.kids.length - 1 _}}
  {{val}},
{{#else _}}
  and {{val}}
{{/if}}
{{/each}}
`

describe('Helper tests', () => {
  it('parses a simple helper: each and if', () => {
    var res = Render(eachTemplate, { kids: ['Ben', 'Polly', 'Joel', 'Phronsie', 'Davie'] })
    expect(res).toEqual(
      `The Daugherty's have 8 kids. Their names are:

Ben,
Polly,
Joel,
Phronsie,
and Davie`
    )
  })

  var forEachTemplate = `
{{~foreach (it.numbers) => key, val}}
Key: {{key}}, Val: {{val}}

{{/foreach}}
`

  it('parses a simple helper: foreach', () => {
    var res = Render(forEachTemplate, { numbers: { one: 1, two: 2 } })

    expect(res).toEqual('Key: one, Val: 1\nKey: two, Val: 2\n')
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
    if (typeof str !== 'string') {
      throw new Error('str does not fit expected format')
    } else {
      return str
    }
  })

  it('parses a simple helper: try', () => {
    var res = Render(tryCatchTemplate, { hi: false })
    expect(res).toEqual(`This won't work: 
Uh-oh, error! Message was 'str does not fit expected format'
`)
  })

  var ifTemplate = `{{ ~if (it.number === 3) -}}
Number is three
{{- #elif (it.number === 4) -}}
Number is four
{{- #else -}}
Number is five
{{- /if}}`

  it('parses a simple helper: if with elif', () => {
    var res = Render(ifTemplate, { number: 4 })

    expect(res).toEqual('Number is four')
  })

  var ifTemplateFilter = `
{{~ if (it.number === 3) | filterThatShouldntBeHere}}
Number is three
{{/if}}
`

  var ifTemplateBlock = `
{{~ if (it.number === 3) | filterThatShouldntBeHere}}
Number is three
{{#tomato}}
Uh-oh, If doesn't know what to do
{{/if}}
`

  test('throws when if helper has filters', () => {
    expect(() => {
      CompileToString(ifTemplateFilter, Env.default)
    }).toThrow()
  })

  test('throws when if helper has unrecognized blocks', () => {
    expect(() => {
      CompileToString(ifTemplateBlock, Env.default)
    }).toThrow()
  })

  var tryTemplateFilter = `
{{~try | filter1}}
Some content
{{#catch => err}}
Uh-oh, error! Message was '{{err.message}}'
{{/try}}
`

  var tryTemplateBlock = `
{{~try}}
Some content
{{#catch => err}}
Uh-oh, error! Message was '{{err.message}}'
{{#tomato}}
// The above block isn't recognized
{{/try}}
`

  test('throws when try catch has filters', () => {
    expect(() => {
      CompileToString(tryTemplateFilter, Env.default)
    }).toThrow()
  })

  test('throws when try catch has unrecognized block', () => {
    expect(() => {
      CompileToString(tryTemplateBlock, Env.default)
    }).toThrow()
  })
})
