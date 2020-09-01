import EtaErr from './err'

export var promiseImpl = new Function('return this')().Promise

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

export function trimLeft(str: string): string {
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!String.prototype.trimLeft) {
    return str.trimLeft()
  } else {
    return str.replace(/^\s+/, '')
  }
}

export function trimRight(str: string): string {
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!String.prototype.trimRight) {
    return str.trimRight()
  } else {
    return str.replace(/\s+$/, '') // TODO: do we really need to replace BOM's?
  }
}
