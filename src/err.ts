// v 1.0.32
class SqrlErr extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Squirrelly Error'
  }
}

// TODO: Class transpilation adds a lot to the bundle size

export function ParseErr(message: string, str: string, indx: number) {
  var whitespace = str
    .slice(0, indx) // +2 because of {{
    .split(/\n/)

  // console.log('whitespace: \n' + JSON.stringify(whitespace))
  var lineNo = whitespace.length
  var colNo = whitespace[lineNo - 1].length + 1
  message +=
    ' at line ' +
    lineNo +
    ' col ' +
    colNo +
    ':\n\n' +
    '  ' +
    str.split(/\n/)[lineNo - 1] +
    '\n' +
    '  ' +
    Array(colNo).join(' ') +
    '^'
  throw new SqrlErr(message)
}
