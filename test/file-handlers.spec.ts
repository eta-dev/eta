import { renderFile } from '../src/index'
import { defaultConfig } from '../src/config'

var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/simple.sqrl')

const complexTemplate = fs.readFileSync(filePath, 'utf8')

describe('File handlers test', () => {
  it('parses a simple template', async () => {
    var renderedFile = await renderFile(filePath, { name: 'Ben' })

    expect(renderedFile).toEqual('Hi Ben')
  })

  it('parses a simple template w/ a callback', async () => {
    renderFile(filePath, { name: 'Ben' }, function (err, res) {
      expect(res).toEqual('Hi Ben')
    })
  })

  it('parses a simple template w/ cache', async () => {
    renderFile(filePath, { name: 'Ben', cache: true }, function (err, res) {
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
          'view options': { autoEscape: false }
        }
      },
      function (err, res) {
        expect(res).toEqual('Hi Ben')
      }
    )
  })
})
