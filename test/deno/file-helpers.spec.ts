import { assertEquals, assertThrows } from 'https://deno.land/std@0.97.0/testing/asserts.ts'
import * as path from 'https://deno.land/std@0.97.0/path/mod.ts'
const __dirname = new URL('.', import.meta.url).pathname

import { render, templates, compile } from '../../deno_dist/mod.ts'

templates.define('test-template', compile('Saluton <%=it.name%>'))

Deno.test('include works', () => {
  const renderedTemplate = render('<%~ include("test-template", it) %>', { name: 'Ada' })

  assertEquals(renderedTemplate, 'Saluton Ada')
})

Deno.test('includeFile works w/ filename prop', () => {
  const renderedTemplate = render(
    '<%~ includeFile("simple", it) %>',
    { name: 'Ada' },
    { filename: path.join(__dirname, '../templates/placeholder.eta') }
  )

  assertEquals(renderedTemplate, 'Hi Ada')
})

Deno.test('"E.includeFile" works with "views" array', () => {
  const renderedTemplate = render(
    '<%~ E.includeFile("randomtemplate", it) %>',
    { user: 'Ben' },
    { views: [path.join(__dirname, '../templates'), path.join(__dirname, '../othertemplates')] }
  )

  assertEquals(renderedTemplate, 'This is a random template. Hey Ben')
})

Deno.test('"includeFile" works with "views" array', () => {
  const renderedTemplate = render(
    '<%~ includeFile("randomtemplate", it) %>',
    { user: 'Ben' },
    { views: [path.join(__dirname, '../templates'), path.join(__dirname, '../othertemplates')] }
  )

  assertEquals(renderedTemplate, 'This is a random template. Hey Ben')
})

Deno.test('"includeFile" works with "views" string', () => {
  const renderedTemplate = render(
    '<%~ includeFile("randomtemplate", it) %>',
    { user: 'Ben' },
    { views: path.join(__dirname, '../othertemplates') }
  )

  assertEquals(renderedTemplate, 'This is a random template. Hey Ben')
})

Deno.test('throws if helper "includeFile" cannot find template', () => {
  assertThrows(
    () => {
      render(
        '<%~ includeFile("imaginary-template", it) %>',
        { user: 'Ben' },
        { views: [path.join(__dirname, '../templates'), path.join(__dirname, '../othertemplates')] }
      )
    },
    Error,
    `Could not find the template "imaginary-template". Paths tried: ${path.join(
      __dirname,
      '../templates'
    )}/imaginary-template.eta,${path.join(__dirname, '../othertemplates')}/imaginary-template.eta`
  )
})
