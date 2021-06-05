import { assertEquals, assertThrows } from 'https://deno.land/std@0.97.0/testing/asserts.ts'
import { render } from '../../deno_dist/mod.ts'

// SHOULD TEST COMMON ETA USAGE PATTERNS HERE

const eachTemplate = `
The Daugherty's have 5 kids:
<ul>
<% it.kids.forEach(function(kid){ %>
<li><%= kid %></li>
<% }) %>
</ul>`

Deno.test('Loop over an array', () => {
  const res = render(eachTemplate, { kids: ['Ben', 'Polly', 'Joel', 'Phronsie', 'Davie'] })

  assertEquals(
    res,
    `
The Daugherty's have 5 kids:
<ul>
<li>Ben</li>
<li>Polly</li>
<li>Joel</li>
<li>Phronsie</li>
<li>Davie</li>
</ul>`
  )
})

Deno.test('throws if helper "include" cannot find template', () => {
  assertThrows(
    () => {
      render('<%~ include("missing-template", it) %>', {})
    },
    Error,
    'Could not fetch template "missing-template"'
  )
})
