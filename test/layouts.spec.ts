import { path } from '../src/file-methods'
/* global it, expect, describe */

import { compile, render, renderFile, templates } from '../src/index'

describe('Layout Tests', () => {
  it('Nested layouts work as expected', async () => {
    var res = await renderFile(
      'index.eta',
      { title: 'Cool  Title' },
      // Async can be true or false
      { views: path.join(__dirname, 'templates'), async: true }
    )

    expect(res).toEqual(`<!DOCTYPE html>
<html lang="en">
<head>
    <title>Cool  Title</title>
</head>
<body>
This is the template body.
</body>
</html>`)
  })

  it('Layouts fall back to include if includeFile is undefined', async () => {
    templates.define(
      'my-layout',
      compile(`###<%= it.title %>###,<%~ it.body %>`, { includeFile: undefined })
    )

    var res = await render(
      `<% layout("my-layout") %>
This is a layout`,
      { title: 'Cool Title' },
      { includeFile: undefined }
    )

    expect(res).toEqual('###Cool Title###,This is a layout')
  })
})
