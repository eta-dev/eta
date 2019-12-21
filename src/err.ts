// v 1.0.32

var setPrototypeOf =
  Object.setPrototypeOf ||
  function(obj, proto) {
    obj.__proto__ = proto
    return obj
  }

function SqrlErr(message: string) {
  var err = new Error(message)
  setPrototypeOf(err, SqrlErr.prototype)
  return err
}

SqrlErr.prototype = Object.create(Error.prototype, {
  name: { value: 'Squirrelly Error', enumerable: false }
})

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
  throw SqrlErr(message)
}
