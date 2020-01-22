import Render from '../src/render'

describe('Simple Render checks', () => {
  describe('Render works', () => {
    it('Simple template compiles', () => {
      expect(Render('Hi {{it.name}}', { name: 'Ada Lovelace' })).toEqual('Hi Ada Lovelace')
    })
    it('String trimming works', () => {
      expect(Render('Hi  {{-it.name_}}  !', { name: 'Ada Lovelace' })).toEqual('Hi Ada Lovelace!')
    })
  })
})
