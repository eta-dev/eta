import { trimWS } from '../src/utils'
import { defaultConfig } from '../src/config'

describe('Whitespace trim', () => {
  describe('#trimLeft', () => {
    it('WS slurp with str.trimLeft', () => {
      expect(trimWS('  jestjs', defaultConfig, '_')).toBe('jestjs')
    })
    it('WS slurp without str.trimLeft', () => {
      Object.defineProperty(String.prototype, 'trimLeft', { value: undefined })
      expect(trimWS('  jestjs', defaultConfig, '_')).toBe('jestjs')
    })
    it('WS 1 char', () => {
      expect(trimWS('\njestjs', defaultConfig, '-')).toBe('jestjs')
    })
    it('WS slurp and WS 1 char are equal with 1 char of whitespace', () => {
      Object.defineProperty(String.prototype, 'trimLeft', { value: undefined })
      expect(trimWS(' jestjs', defaultConfig, '_')).toBe(trimWS('\njestjs', defaultConfig, '-'))
    })
  })

  describe('#trimRight', () => {
    it('WS slurp with str.trimRight', () => {
      expect(trimWS('jestjs  ', defaultConfig, '', '_')).toBe('jestjs')
    })
    it('WS slurp without str.trimRight', () => {
      Object.defineProperty(String.prototype, 'trimRight', { value: undefined })
      expect(trimWS('jestjs  ', defaultConfig, '', '_')).toBe('jestjs')
    })
    it('WS 1 char', () => {
      expect(trimWS('jestjs\n', defaultConfig, '', '-')).toBe('jestjs')
    })
    it('WS slurp and WS 1 char are equal with 1 char of whitespace', () => {
      Object.defineProperty(String.prototype, 'trimRight', { value: undefined })
      expect(trimWS('jestjs ', defaultConfig, '', '_')).toBe(
        trimWS('jestjs\n', defaultConfig, '', '-')
      )
    })
  })
})
