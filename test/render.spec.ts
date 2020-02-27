/* global it, expect, describe */

import render from '../src/render'
import compile from '../src/compile'
import { templates } from '../src/containers'

describe('Simple Render checks', () => {
  describe('Render works', () => {
    it('Simple template compiles', () => {
      expect(render('Hi {{it.name}}', { name: 'Ada Lovelace' })).toEqual('Hi Ada Lovelace')
    })
    it('String trimming works', () => {
      expect(render('Hi \n{{-it.name_}}  !', { name: 'Ada Lovelace' })).toEqual('Hi Ada Lovelace!')
    })
    it('Rendering function works', () => {
      expect(render(compile('Hi \n{{-it.name_}}  !'), { name: 'Ada Lovelace' })).toEqual(
        'Hi Ada Lovelace!'
      )
    })
    it('Rendering function works', async () => {
      let template = 'Hello {{ await it.getName() }}!'
      let getName = () => {
        return new Promise(res => {
          setTimeout(() => {
            res('Ada')
          }, 1000)
        })
      }
      expect(await render(template, { getName: getName }, { async: true })).toEqual('Hello Ada!')
    })
  })
  describe('render errors', () => {
    test("throws when there's an unknown helper", () => {
      expect(() => {
        render('{{~unknown-helper(it.name) /}}', { name: 'Ben' })
      }).toThrow()
    })

    test("throws when there's an unknown filter", () => {
      expect(() => {
        render('{{it.name | unknown-filter}}', { name: 'Ben' })
      }).toThrow()
    })
  })
})

describe('Render caching checks', () => {
  it('Simple template caches', () => {
    render('Hi {{it.name}}', { name: 'Ada Lovelace' }, { cache: true, name: 'template1' })
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
    expect(render('Hi {{name}}', { name: 'Ada Lovelace' }, { useWith: true })).toEqual(
      'Hi Ada Lovelace'
    )
  })

  it('useScope helper works', () => {
    expect(
      render(
        'Hi {{~useScope(it)=>{name} }}{{name}}{{/useScope}}',
        { name: 'Ada Lovelace' },
        { useWith: true }
      )
    ).toEqual('Hi Ada Lovelace')
  })
})
