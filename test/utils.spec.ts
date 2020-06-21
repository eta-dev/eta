/* global it, expect, describe */

import { trimWS, XMLEscape } from '../src/utils'
import { defaultConfig, getConfig } from '../src/index'

describe('Whitespace trim', () => {
  describe('#trimLeft', () => {
    it('WS slurp with str.trimLeft', () => {
      expect(trimWS('  jestjs', defaultConfig, '_')).toBe('jestjs')
    })
    it('WS slurp without str.trimLeft', () => {
      Object.defineProperty(String.prototype, 'trimLeft', { value: undefined })
      expect(trimWS('  jestjs', defaultConfig, '_')).toBe('jestjs')
    })
    it('WS newline', () => {
      expect(trimWS('\njestjs', defaultConfig, '-')).toBe('jestjs')
    })
    it('WS slurp and WS newline are equal with newline', () => {
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
    it('WS newline', () => {
      expect(trimWS('jestjs\n', defaultConfig, '', '-')).toBe('jestjs')
    })
    it('WS slurp and WS newline are equal with newline', () => {
      Object.defineProperty(String.prototype, 'trimRight', { value: undefined })
      expect(trimWS('jestjs ', defaultConfig, '', '_')).toBe(
        trimWS('jestjs\n', defaultConfig, '', '-')
      )
    })
  })

  describe('#trim', () => {
    it('WS slurp both sides', () => {
      expect(trimWS(' somestring  ', getConfig({ autoTrim: ['slurp', 'slurp'] }), '', '')).toBe(
        'somestring'
      )
    })

    it('defaultConfig.autoTrim set to false', () => {
      expect(trimWS(' some string\n  ', getConfig({ autoTrim: false }), '', '')).toBe(
        ' some string\n  '
      )
    })
  })
})

describe('HTML Escape', () => {
  it('properly escapes HTML characters', () => {
    expect(XMLEscape('<p>HTML</p>')).toBe('&lt;p&gt;HTML&lt;/p&gt;')
  })
})
