import { render, templates, compile, renderFile } from '../src/index'
import { defaultConfig } from '../src/config'

var fs = require('fs'),
  path = require('path')

templates.define('test-template', compile('HEY {{it.name}}'))

describe('include works', () => {
  it('simple parser works with "includeFile"', async () => {
    var renderedTemplate = render(
      '{{~includeFile("simple", it)/}}',
      { name: 'Ben' },
      { filename: path.join(__dirname, 'templates/placeholder.sqrl') }
    )

    expect(renderedTemplate).toEqual('Hi Ben')
  })

  it('"includeFile" works with "views" array', async () => {
    var renderedTemplate = render(
      '{{~includeFile("randomtemplate", it)/}}',
      { user: 'Ben' },
      {
        filename: path.join(__dirname, 'templates/placeholder.sqrl'),
        views: [path.join(__dirname, 'templates'), path.join(__dirname, 'othertemplates')]
      }
    )

    expect(renderedTemplate).toEqual('This is a random template. Hey Ben')
  })

  it('simple parser works with "include"', async () => {
    var renderedTemplate = render('{{~include("test-template", it)/}}', { name: 'Ben' })

    expect(renderedTemplate).toEqual('HEY Ben')
  })

  test('throws if helper "includeFile" has blocks', () => {
    expect(() => {
      render('{{~includeFile("test-template", it)}} {{#block1}} {{/includeFile}}', {
        name: 'stuff'
      })
    }).toThrow()
  })

  test('throws if helper "include" has blocks', () => {
    expect(() => {
      render('{{~include("test-template", it)}} {{#block2}} {{/includeFile}}', { name: 'stuff' })
    }).toThrow()
  })
})

describe('extends works', () => {
  var layoutRes = `<h1>My layout</h1>
<h2>
Custom Title
</h2>
Ben's cool site
<p> This is a cool layout by Ben</p>
<strong>This is the content of the page
</strong>`

  it('"extendsFile" works', async () => {
    var renderedTemplate = await renderFile(path.join(__dirname, 'templates/extends.sqrl'), {
      name: 'Ben'
    })

    expect(renderedTemplate).toEqual(layoutRes)
  })

  var extendsTemplate = `{{~extends('layout1', it)}}
This is the content of the page
{{#title}}
Custom Title
{{#description}}
{{it.name}}'s cool site
{{/extends}}`

  var layoutTemplate = `<h1>My layout</h1>
<h2>
{{~block('title')}}
this is the default title
{{/block}}
</h2>
{{~block('description')}}
The default description
{{/block}}
<p> This is a cool layout by {{it.name}}</p>
<strong>{{it.content}}</strong>`

  it('"extends" works', async () => {
    templates.define('layout1', compile(layoutTemplate))

    var renderedTemplate = render(extendsTemplate, { name: 'Ben' })

    expect(renderedTemplate).toEqual(layoutRes)
  })
})
