import Render from '../src/render'
import Compile from '../src/compile'

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
  })
})
