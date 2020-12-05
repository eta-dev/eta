/* global it, expect, describe */

import { renderFile, loadFile, templates } from '../src/index'
import { config } from '../src/config'

const path = require('path'),
  filePath = path.join(__dirname, 'templates/simple.eta')

describe('File tests', () => {
  it('loadFile works', () => {
    loadFile(filePath, { filename: filePath })
    expect(templates.get(filePath)).toBeTruthy()
    expect(templates.get(filePath)({ name: 'Ben' }, config)).toBeTruthy()
  })
})

describe('Filepath caching', () => {
  it('Filepath caching works as expected', async () => {
    // This test renders templates/has-include.eta with caching enabled, then checks to make sure
    // `config.filepathCache` contains the expected result afterward

    const viewsDir = path.join(__dirname, 'templates')

    const templateResult = await renderFile('has-include', {}, { views: viewsDir, cache: true })

    expect(templateResult).toEqual(
      `This is the outermost template. Now we'll include a partial

===========================================================
This is a partial.
Hi Test Runner`
    )

    // The cache is indexed by {filename, path, root, views} (JSON.stringify ignores keys with undefined as their value)

    // Filepath caching is based on the premise that given the same path, includer filename, root directory, and views directory (or directories)
    // the getPath function will always return the same result (assuming that caching is enabled and we're not expecting the templates to change)

    const pathToHasInclude = `{"filename":"${viewsDir}/has-include.eta","path":"./partial","views":"${viewsDir}"}`

    const pathToPartial = `{"filename":"${viewsDir}/partial.eta","path":"./simple","views":"${viewsDir}"}`

    const pathToSimple = `{"path":"has-include","views":"${viewsDir}"}`

    expect(config.filepathCache).toEqual({
      [pathToHasInclude]: `${viewsDir}/partial.eta`,
      [pathToPartial]: `${viewsDir}/simple.eta`,
      [pathToSimple]: `${viewsDir}/has-include.eta`
    })
  })
})
