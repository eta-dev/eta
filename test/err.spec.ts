/* global it, expect, describe */

import { ParseErr } from '../src/err'
describe('ParseErr', () => {
  it('error throws correctly', () => {
    try {
      ParseErr('Something Unexpected Happened!', 'template {{', 9)
    } catch (ex) {
      expect(ex.name).toBe('Squirrelly Error')
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
      expect(ex.name).toBe('Squirrelly Error')
      expect(ex.message).toBe(`Something Unexpected Happened! at line 1 col 10:

  template {{
           ^`)
      expect(ex instanceof Error).toBe(true)
    }
  })
})
