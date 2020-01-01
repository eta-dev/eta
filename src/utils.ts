/**
 * Trims either one whitespace character from the beginning of a string, or all
 *
 * @remarks
 * Includes trimLeft polyfill
 *
 * @param str - String to trim
 * @param type - Either '-' (trim only 1 whitespace char) or '_' (trim all whitespace)
 * @returns Trimmed string
 *
 */

// TODO: allow '-' to trim up until newline. Use [^\S\n\r] instead of \s
// TODO: only include trimLeft polyfill if not in ES6

function trimLeft (str: string, type: string): string {
  if (type === '_') {
    // full slurp
    if (String.prototype.trimLeft) {
      return str.trimLeft()
    } else {
      return str.replace(/^[\s\uFEFF\xA0]+/, '')
    }
  } else {
    // type must be '-'
    return str.replace(/^(?:[\s\uFEFF\xA0]|\r\n)/, '')
  }
}

/**
 * Trims either one whitespace character from the end of the string, or all
 *
 * @remarks
 * Includes trimRight polyfill
 *
 * @param str - String to trim
 * @param type - Either '-' (trim only 1 whitespace char) or '_' (trim all whitespace)
 * @returns Trimmed string
 *
 */

function trimRight (str: string, type: string): string {
  if (type === '_') {
    // full slurp
    if (String.prototype.trimRight) {
      return str.trimRight()
    } else {
      return str.replace(/[\s\uFEFF\xA0]+$/, '')
    }
  } else {
    // type must be '-'
    return str.replace(/(?:[\s\uFEFF\xA0]|\r\n)$/, '') // TODO: make sure this gets \r\n
  }
}

interface EscapeMap {
  '&': '&amp;'
  '<': '&lt;'
  '"': '&quot;'
  "'": '&#39;'
  [index: string]: string
}

var escMap: EscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#39;'
}

function replaceChar (s: string): string {
  return escMap[s]
}

function XMLEscape (str: any) {
  // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
  var newStr = String(str)
  if (/[&<"']/.test(newStr)) {
    return newStr.replace(/[&<"']/g, replaceChar)
  } else {
    return newStr
  }
}

export { trimLeft, trimRight, XMLEscape }
