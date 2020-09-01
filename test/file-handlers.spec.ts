/* global it, expect, describe */

import { renderFile } from '../src/index'

var path = require('path'),
  filePath = path.join(__dirname, 'templates/simple.eta')

describe('File handlers test', () => {
  it('parses a simple template', async () => {
    var renderedFile = await renderFile(filePath, { name: 'Ben' })

    expect(renderedFile).toEqual('Hi Ben')
  })

  it('render file with callback works', (done) => {
    function cb(_err: Error | null, res?: string) {
      try {
        expect(res).toBe('Hi Ada Lovelace')
        done()
      } catch (error) {
        done(error)
      }
    }

    renderFile(filePath, { name: 'Ada Lovelace', async: true }, cb)
  })

  it('parses a simple template w/ a callback', async () => {
    renderFile(filePath, { name: 'Ben' }, function (_err, res) {
      expect(res).toEqual('Hi Ben')
    })
  })

  it('parses a simple template w/ cache', async () => {
    renderFile(filePath, { name: 'Ben', cache: true }, function (_err, res) {
      expect(res).toEqual('Hi Ben')
    })
  })

  // TODO: the above doesn't even really do anything

  it('parses a simple template w/ settings from Express', async () => {
    renderFile(
      filePath,
      {
        name: 'Ben',
        cache: true,
        settings: {
          views: ['templates', 'othertemplates'],
          'view cache': true,
          'view options': { autoEscape: false },
        },
      },
      function (_err, res) {
        expect(res).toEqual('Hi Ben')
      }
    )
  })
})
