import EtaErr from './err'

/**
 * @returns The global Promise function
 */

export const promiseImpl: PromiseConstructor = new Function('return this')().Promise

/**
 * @returns A new AsyncFunction constuctor
 */

export function getAsyncFunctionConstructor(): Function {
  try {
    return new Function('return (async function(){}).constructor')()
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw EtaErr("This environment doesn't support async/await")
    } else {
      throw e
    }
  }
}

/**
 * str.trimLeft polyfill
 *
 * @param str - Input string
 * @returns The string with left whitespace removed
 *
 */

export function trimLeft(str: string): string {
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!String.prototype.trimLeft) {
    return str.trimLeft()
  } else {
    return str.replace(/^\s+/, '')
  }
}

/**
 * str.trimRight polyfill
 *
 * @param str - Input string
 * @returns The string with right whitespace removed
 *
 */

export function trimRight(str: string): string {
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!String.prototype.trimRight) {
    return str.trimRight()
  } else {
    return str.replace(/\s+$/, '') // TODO: do we really need to replace BOM's?
  }
}
