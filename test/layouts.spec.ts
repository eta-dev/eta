import { path } from '../src/file-methods'
/* global it, expect, describe */

import { renderFile } from '../src/index'

describe('Layout Tests', () => {
  it('Layout works as expected', async () => {
    var res = await renderFile(
      'index.eta',
      { title: 'Cool  Title' },
      // Async can be true or false
      { views: path.join(__dirname, 'templates'), async: false }
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
})
