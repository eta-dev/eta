/* global it, expect, describe */

import Render from '../src/render'
import Compile from '../src/compile'
import { templates } from '../src/containers'

describe('Simple Render checks', () => {
  describe('Render works', () => {
    it('Simple template compiles', () => {
      expect(Render('Hi {{it.name}}', { name: 'Ada Lovelace' })).toEqual('Hi Ada Lovelace')
    })
    it('String trimming works', () => {
      expect(Render('Hi \n{{-it.name_}}  !', { name: 'Ada Lovelace' })).toEqual('Hi Ada Lovelace!')
    })
    it('Rendering function works', () => {
      expect(Render(Compile('Hi \n{{-it.name_}}  !'), { name: 'Ada Lovelace' })).toEqual(
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
      expect(await Render(template, { getName: getName }, { async: true })).toEqual('Hello Ada!')
    })
  })
})

describe('Render caching checks', () => {
  it('Simple template caches', () => {
    Render('Hi {{it.name}}', { name: 'Ada Lovelace' }, { cache: true, name: 'template1' })
    expect(templates.get('template1')).toBeTruthy()
  })

  it('Simple template works again', () => {
    expect(
      Render("This shouldn't show up", { name: 'Ada Lovelace' }, { cache: true, name: 'template1' })
    ).toEqual('Hi Ada Lovelace')
  })
})

describe('Renders with different scopes', () => {
  it('Puts `it` in global scope with env.useWith', () => {
    expect(Render('Hi {{name}}', { name: 'Ada Lovelace' }, { useWith: true })).toEqual(
      'Hi Ada Lovelace'
    )
  })

  it('useScope helper works', () => {
    expect(
      Render(
        'Hi {{~useScope(it)=>{name} }}{{name}}{{/useScope}}',
        { name: 'Ada Lovelace' },
        { useWith: true }
      )
    ).toEqual('Hi Ada Lovelace')
  })
})
