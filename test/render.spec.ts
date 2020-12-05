/* global it, expect, describe */

import render, { renderAsync } from '../src/render'
import compile from '../src/compile'
import { templates } from '../src/containers'

describe('Simple Render checks', () => {
  describe('Render works', () => {
    it('Simple template compiles', () => {
      expect(render('Hi <%= it.name%>', { name: 'Ada Lovelace' })).toEqual('Hi Ada Lovelace')
    })
    it('String trimming works', () => {
      expect(render('Hi \n<%- =it.name_%>  !', { name: 'Ada Lovelace' })).toEqual(
        'Hi Ada Lovelace!'
      )
    })
    it('Rendering function works', () => {
      expect(render(compile('Hi \n<%- =it.name_%>  !'), { name: 'Ada Lovelace' })).toEqual(
        'Hi Ada Lovelace!'
      )
    })
    it('Rendering function works', async () => {
      const template = 'Hello <%= await it.getName() %>!'
      const getName = () => {
        return new Promise((res) => {
          setTimeout(() => {
            res('Ada')
          }, 20)
        })
      }
      expect(await render(template, { getName }, { async: true })).toEqual('Hello Ada!')
    })
    it('Rendering async function works', async () => {
      const template = 'Hello <%= await it.getName() %>!'
      const getName = () => {
        return new Promise((res) => {
          setTimeout(() => {
            res('Ada')
          }, 20)
        })
      }
      expect(await renderAsync(template, { getName })).toEqual('Hello Ada!')
    })
  })
})

describe('Render caching checks', () => {
  it('Simple template caches', () => {
    render('Hi <%=it.name%>', { name: 'Ada Lovelace' }, { cache: true, name: 'template1' })
    expect(templates.get('template1')).toBeTruthy()
  })

  it('Simple template works again', () => {
    expect(
      render("This shouldn't show up", { name: 'Ada Lovelace' }, { cache: true, name: 'template1' })
    ).toEqual('Hi Ada Lovelace')
  })
})

describe('Renders with different scopes', () => {
  it('Puts `it` in global scope with env.useWith', () => {
    expect(render('Hi <%=name%>', { name: 'Ada Lovelace' }, { useWith: true })).toEqual(
      'Hi Ada Lovelace'
    )
  })
})

describe('processTemplate plugin', () => {
  it('Simple plugin works correctly', () => {
    const template = ':thumbsup:'

    const emojiTransform = {
      processTemplate: function (str: string) {
        return str.replace(':thumbsup:', '👍')
      }
    }

    const res = render(
      template,
      {},
      {
        plugins: [emojiTransform]
      }
    )

    expect(res).toEqual('👍')
  })

  it('Multiple chained plugins work correctly', () => {
    const template = ':thumbsup: This is a cool template'

    const emojiTransform = {
      processTemplate: function (str: string) {
        return str.replace(':thumbsup:', '👍')
      }
    }

    const capitalizeCool = {
      processTemplate: function (str: string) {
        return str.replace('cool', 'COOL')
      }
    }

    const replaceThumbsUp = {
      processTemplate: function (str: string) {
        return str.replace('👍', '✨')
      }
    }

    const res = render(
      template,
      {},
      {
        plugins: [emojiTransform, capitalizeCool, replaceThumbsUp]
      }
    )

    expect(res).toEqual('✨ This is a COOL template')
  })
})
