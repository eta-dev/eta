import { path } from '../src/file-methods'
/* global it, expect, describe */

import { compile, render, renderFile, templates } from '../src/index'

describe('Layout Tests', () => {
  it('Nested layouts work as expected', async () => {
    const res = await renderFile(
      'index.eta',
      { title: 'Cool Title' },
      // Async can be true or false
      { views: path.join(__dirname, 'templates'), async: true }
    )

    expect(res).toEqual(`<!DOCTYPE html>
<html lang="en">
<head>
    <title>Cool Title</title>
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

    const res = await render(
      `<% layout("my-layout") %>
This is a layout`,
      { title: 'Cool Title' },
      { includeFile: undefined }
    )

    expect(res).toEqual('###Cool Title###,This is a layout')
  })

  it("Layouts are called with arguments if they're provided", async () => {
    templates.define(
      'my-layout',
      compile(`<%= it.title %> - <%~ it.body %> - <%~ it.content %> - <%~ it.randomNum %>`, {
        includeFile: undefined
      })
    )

    const res = await render(
      `<% layout("my-layout", { title: 'Nifty title', content: 'Nice content'}) %>
This is a layout`,
      { title: 'Cool Title', randomNum: 3 },
      { includeFile: undefined }
    )

    // Note that layouts automatically accept the data of the template which called them,
    // after it is merged with {body:tR} and custom data

    expect(res).toEqual('Nifty title - This is a layout - Nice content - 3')
  })
})
