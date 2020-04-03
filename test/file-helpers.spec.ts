/* global it, expect, describe */

import { render, templates, compile, renderFile } from '../src/index'

var path = require('path')

templates.define('test-template', compile('HEY <%=it.name%>'))

describe('include works', () => {
  it('simple parser works with "includeFile"', async () => {
    var renderedTemplate = render(
      '<% @includeFile("simple", it) %>',
      { name: 'Ben' },
      { filename: path.join(__dirname, 'templates/placeholder.eta') }
    )

    expect(renderedTemplate).toEqual('Hi Ben')
  })

  it('"includeFile" works with "views" array', async () => {
    var renderedTemplate = render(
      '<% @includeFile("randomtemplate", it) %>',
      { user: 'Ben' },
      {
        filename: path.join(__dirname, 'templates/placeholder.eta'),
        views: [path.join(__dirname, 'templates'), path.join(__dirname, 'othertemplates')]
      }
    )

    expect(renderedTemplate).toEqual('This is a random template. Hey Ben')
  })

  it('simple parser works with "include"', async () => {
    var renderedTemplate = render('<% @include("test-template", it) %>', { name: 'Ben' })

    expect(renderedTemplate).toEqual('HEY Ben')
  })

  test('throws if helper "includeFile" cannot find template', () => {
    expect(() => {
      render(
        '<% @includeFile("missing-template", it) %>',
        {},
        {
          filename: path.join(__dirname, 'templates/placeholder.eta'),
          views: [path.join(__dirname, 'templates'), path.join(__dirname, 'othertemplates')]
        }
      )
    }).toThrow(new Error('Could not find the include file "missing-template"'))
  })
})
