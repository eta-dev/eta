import { Render, Templates, Compile } from '../src/index'
import { defaultConfig } from '../src/config'

var fs = require('fs'),
  path = require('path')

Templates.define('test-template', Compile('HEY {{it.name}}'))

describe('include works', () => {
  it('simple parser works with "includeFile"', async () => {
    var renderedTemplate = Render(
      '{{~includeFile("simple", it)/}}',
      { name: 'Ben' },
      { filename: path.join(__dirname, 'templates/placeholder.sqrl') }
    )

    expect(renderedTemplate).toEqual('Hi Ben')
  })

  it('"includeFile" works with "views" array', async () => {
    var renderedTemplate = Render(
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
    var renderedTemplate = Render('{{~include("test-template", it)/}}', { name: 'Ben' })

    expect(renderedTemplate).toEqual('HEY Ben')
  })

  test('throws if helper "includeFile" has blocks', () => {
    expect(() => {
      Render('{{~includeFile("test-template", it)}} {{#block1}} {{/includeFile}}', {
        name: 'stuff'
      })
    }).toThrow()
  })

  test('throws if helper "include" has blocks', () => {
    expect(() => {
      Render('{{~include("test-template", it)}} {{#block2}} {{/includeFile}}', { name: 'stuff' })
    }).toThrow()
  })
})
