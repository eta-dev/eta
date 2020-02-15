import { loadFile, templates } from '../src/index'
import { defaultConfig } from '../src/config'
import SqrlErr from '../src/err'

var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/simple.sqrl')

describe('File tests', () => {
  it('loadFile works', () => {
    loadFile(filePath, { filename: filePath })
    expect(templates.get(filePath)).toBeTruthy()
    expect(templates.get(filePath)({ name: 'Ben' }, defaultConfig)).toBeTruthy()
  })

  // test('throws with unclosed tag', () => {
  //   expect(() => {
  //     Parse('{{hi("hey")', defaultConfig)
  //   }).toThrow()
  // })
})
