import { loadFile, Templates } from '../src/index'
import { defaultConfig } from '../src/config'
import SqrlErr from '../src/err'

var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/simple.sqrl')

describe('File tests', () => {
  it('loadFile works', () => {
    loadFile(filePath, { filename: filePath })
    expect(Templates.get(filePath)).toBeTruthy()
    expect(Templates.get(filePath)({ name: 'Ben' }, defaultConfig)).toBeTruthy()
  })

  // test('throws with unclosed tag', () => {
  //   expect(() => {
  //     Parse('{{hi("hey")', defaultConfig)
  //   }).toThrow()
  // })
})
