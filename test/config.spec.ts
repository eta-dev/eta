/* global it, expect, describe */

import { render, defaultConfig } from '../src/index'
import { config, configure, getConfig } from '../src/config'

describe('Config Tests', () => {
  it('Renders a simple template with default env', () => {
    var res = render('hi <%= it.name %>', { name: 'Ben' }, defaultConfig)
    expect(res).toEqual('hi Ben')
  })

  it('Renders a simple template with custom tags', () => {
    var res = render('hi <<= it.name >>', { name: 'Ben' }, { tags: ['<<', '>>'] })
    expect(res).toEqual('hi Ben')
  })

  it('Renders a simple template with stored env', () => {
    var res = render('<%= it.html %>', { html: '<p>Hi</p>' }, { autoEscape: false })
    expect(res).toEqual('<p>Hi</p>') // not escaped
  })

  it('Configure command works', () => {
    var updatedConfig = configure({ tags: ['{{', '}}'] })

    var res = render('{{= it.name }}', { name: 'John Appleseed' })
    expect(res).toEqual('John Appleseed')

    expect(defaultConfig).toEqual(updatedConfig)
    expect(defaultConfig.tags).toEqual(['{{', '}}'])
  })

  it('config and defaultConfig are the same object', () => {
    expect(defaultConfig).toEqual(config)
  })

  it('getConfig creates a clone of config with no arguments', () => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore (in this case, we're calling getConfig w/ 0 arguments even though it takes 1 or 2)
    expect(getConfig()).toEqual(config)
  })
})
