// TODO: allow '-' to trim up until newline. Use [^\S\n\r] instead of \s
// TODO: only include trimLeft polyfill if not in ES6

import { trimLeft, trimRight } from './polyfills'

/* TYPES */

import { EtaConfig } from './config'

interface EscapeMap {
  '&': '&amp;'
  '<': '&lt;'
  '>': '&gt;'
  '"': '&quot;'
  "'": '&#39;'
  [index: string]: string
}

/* END TYPES */

export function hasOwnProp(obj: object, prop: string) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function copyProps<T>(toObj: T, fromObj: T) {
  for (var key in fromObj) {
    if (hasOwnProp((fromObj as unknown) as object, key)) {
      toObj[key] = fromObj[key]
    }
  }
  return toObj
}

function trimWS(
  str: string,
  env: EtaConfig,
  wsLeft: string | false,
  wsRight?: string | false
): string {
  var leftTrim
  var rightTrim

  if (Array.isArray(env.autoTrim)) {
    // kinda confusing
    // but _}} will trim the left side of the following string
    leftTrim = env.autoTrim[1]
    rightTrim = env.autoTrim[0]
  } else {
    leftTrim = rightTrim = env.autoTrim
  }

  if (wsLeft || wsLeft === false) {
    leftTrim = wsLeft
  }

  if (wsRight || wsRight === false) {
    rightTrim = wsRight
  }

  if (!rightTrim && !leftTrim) {
    return str
  }

  if (leftTrim === 'slurp' && rightTrim === 'slurp') {
    return str.trim()
  }

  if (leftTrim === '_' || leftTrim === 'slurp') {
    // console.log('trimming left' + leftTrim)
    // full slurp

    str = trimLeft(str)
  } else if (leftTrim === '-' || leftTrim === 'nl') {
    // nl trim
    str = str.replace(/^(?:\r\n|\n|\r)/, '')
  }

  if (rightTrim === '_' || rightTrim === 'slurp') {
    // full slurp
    str = trimRight(str)
  } else if (rightTrim === '-' || rightTrim === 'nl') {
    // nl trim
    str = str.replace(/(?:\r\n|\n|\r)$/, '') // TODO: make sure this gets \r\n
  }

  return str
}

var escMap: EscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function replaceChar(s: string): string {
  return escMap[s]
}

function XMLEscape(str: any) {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
  var newStr = String(str)
  if (/[&<>"']/.test(newStr)) {
    return newStr.replace(/[&<>"']/g, replaceChar)
  } else {
    return newStr
  }
}

export { trimWS, XMLEscape }
