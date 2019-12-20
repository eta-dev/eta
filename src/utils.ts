function trimLeft(str: string, type: string): string {
  if (type === '_') {
    // full slurp
    if (String.prototype.trimLeft) {
      return str.trimLeft()
    } else {
      return str.replace(/^[\s\uFEFF\xA0]+/, '')
    }
  } else if (type === '-') {
    return str.replace(/^(?:[\s\uFEFF\xA0]|\r\n)/, '')
  }
  return str
  // else something's wrong
}

function trimRight(str: string, type: string): string {
  if (type === '_') {
    // full slurp
    if (String.prototype.trimRight) {
      return str.trimRight()
    } else {
      return str.replace(/[\s\uFEFF\xA0]+$/, '')
    }
  } else if (type === '-') {
    return str.replace(/(?:[\s\uFEFF\xA0]|\r\n)$/, '') // TODO: make sure this gets \r\n
  }
  return str
}

export { trimLeft, trimRight }
