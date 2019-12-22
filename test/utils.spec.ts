import { trimLeft, trimRight } from '../src/utils'
describe('trimLeft and trimRight', () => {
  describe('#trimLeft', () => {
    it('WS slurp with str.trimLeft', () => {
      expect(trimLeft('  jestjs', '_')).toBe('jestjs')
    })
    it('WS slurp without str.trimLeft', () => {
      Object.defineProperty(String.prototype, 'trimLeft', { value: undefined })
      expect(trimLeft('  jestjs', '_')).toBe('jestjs')
    })
    it('WS 1 char', () => {
      expect(trimLeft('  jestjs', '-')).toBe(' jestjs')
    })
    it('WS slurp and WS 1 char are equal with 1 char of whitespace', () => {
      Object.defineProperty(String.prototype, 'trimLeft', { value: undefined })
      expect(trimLeft(' jestjs', '_')).toBe(trimLeft(' jestjs', '-'))
    })
  })

  describe('#trimRight', () => {
    it('WS slurp with str.trimRight', () => {
      expect(trimRight('jestjs  ', '_')).toBe('jestjs')
    })
    it('WS slurp without str.trimRight', () => {
      Object.defineProperty(String.prototype, 'trimRight', { value: undefined })
      expect(trimRight('jestjs  ', '_')).toBe('jestjs')
    })
    it('WS 1 char', () => {
      expect(trimRight('jestjs  ', '-')).toBe('jestjs ')
    })
    it('WS slurp and WS 1 char are equal with 1 char of whitespace', () => {
      Object.defineProperty(String.prototype, 'trimRight', { value: undefined })
      expect(trimRight('jestjs ', '_')).toBe(trimRight('jestjs ', '-'))
    })
  })
})
