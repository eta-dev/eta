/* global it, expect, describe */

import { ParseErr } from '../src/err'

// So we can build a RegEx to test our errors against (used in other spec files)
export function buildRegEx(string: string) {
  return RegExp(string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&').replace(/\r\n|\n|\r/g, '\\n'))
}

describe('ParseErr', () => {
  it('error throws correctly', () => {
    try {
      ParseErr('Something Unexpected Happened!', 'template {{', 9)
    } catch (ex) {
      expect(ex.name).toBe('Eta Error')
      expect(ex.message).toBe(`Something Unexpected Happened! at line 1 col 10:

  template {{
           ^`)
      expect(ex instanceof Error).toBe(true)
    }
  })
  it('error throws without Object.setPrototypeOf', () => {
    Object.defineProperty(Object, 'setPrototypeOf', { value: undefined })
    try {
      ParseErr('Something Unexpected Happened!', 'template {{', 9)
    } catch (ex) {
      expect(ex.name).toBe('Eta Error')
      expect(ex.message).toBe(`Something Unexpected Happened! at line 1 col 10:

  template {{
           ^`)
      expect(ex instanceof Error).toBe(true)
    }
  })
})
