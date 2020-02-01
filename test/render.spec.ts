import Render from '../src/render'
import Compile from '../src/compile'
import { Config } from '../src/config'

describe('Simple Render checks', () => {
  describe('Render works', () => {
    it('Simple template compiles', () => {
      expect(Render('Hi {{it.name}}', { name: 'Ada Lovelace' })).toEqual('Hi Ada Lovelace')
    })
    it('String trimming works', () => {
      expect(Render('Hi \n{{-it.name_}}  !', { name: 'Ada Lovelace' })).toEqual('Hi Ada Lovelace!')
    })
    it('Rendering function works', () => {
      expect(Render(Compile('Hi \n{{-it.name_}}  !', 'default'), { name: 'Ada Lovelace' })).toEqual(
        'Hi Ada Lovelace!'
      )
    })
    it('Rendering function works', async () => {
      let template = 'Hello {{ await it.getName() }}!'
      let getName = () => {
        return new Promise((res, rej) => {
          setTimeout(() => {
            res('Ada')
          }, 1000)
        })
      }
      expect(await Render(template, { getName: getName }, { async: true })).toEqual('Hello Ada!')
    })
  })
})
