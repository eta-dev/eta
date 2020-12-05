/* global it, expect, describe */

import { render, defaultConfig } from '../src/index'
import { config, configure, getConfig } from '../src/config'

describe('Config Tests', () => {
  it('Renders a simple template with default env', () => {
    const res = render('hi <%= it.name %>', { name: 'Ben' }, defaultConfig)
    expect(res).toEqual('hi Ben')
  })

  it('Renders a simple template with custom tags', () => {
    const res = render('hi <<= it.name >>', { name: 'Ben' }, { tags: ['<<', '>>'] })
    expect(res).toEqual('hi Ben')
  })

  it('Renders a simple template with stored env', () => {
    const res = render('<%= it.html %>', { html: '<p>Hi</p>' }, { autoEscape: false })
    expect(res).toEqual('<p>Hi</p>') // not escaped
  })

  it('config.filter works', () => {
    const template = 'My favorite food is <%= it.fav %>'

    expect(render(template, {})).toEqual('My favorite food is undefined')

    expect(
      render(
        template,
        {},
        {
          filter: function () {
            return 'apples'
          }
        }
      )
    ).toEqual('My favorite food is apples')

    let timesFilterCalled = 0

    expect(
      render(
        '<%= it.val1 %>, <%~ it.val2 %>, <%~ it.val3 %>',
        {},
        {
          filter: function () {
            timesFilterCalled++
            if (timesFilterCalled <= 1) {
              return 'The first'
            } else {
              return 'another'
            }
          }
        }
      )
    ).toEqual('The first, another, another')
  })

  it('Configure command works', () => {
    const updatedConfig = configure({ tags: ['{{', '}}'] })

    const res = render('{{= it.name }}', { name: 'John Appleseed' })
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
