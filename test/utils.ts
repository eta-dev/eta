import { Parse } from '../src/index'
var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'templates/complex.sqrl')

/**
 * Dummy test
 */
describe('Make sure Parse works with utils', () => {
  it('parses ws slurp', () => {
    var buff = Parse('   {{_ stuff _}}    ', '{{', '}}')
    expect(buff).toBeTruthy()
  })

  it('parses ws single', () => {
    var buff = Parse('   {{- stuff -}}    ', '{{', '}}')
    expect(buff).toBeTruthy()
  })

  it('parses without native string.trimLeft&trimRight', () => {
    delete String.prototype.trimLeft
    delete String.prototype.trimRight

    var buff = Parse('   {{- stuff -}}    ', '{{', '}}')
    expect(buff).toBeTruthy()
  })

  it('parses ws single without native string.trimLeft&trimRight', () => {
    delete String.prototype.trimLeft
    delete String.prototype.trimRight

    var buff = Parse('   {{- stuff -}}    ', '{{', '}}')
    expect(buff).toBeTruthy()
  })
})

console.log('  hi'.trimLeft()) //  making sure I didn't break string permanently
