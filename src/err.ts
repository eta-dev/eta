function setPrototypeOf (obj: any, proto: any) {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(obj, proto)
  } else {
    obj.__proto__ = proto
  }
}

export default function EtaErr (message: string): Error {
  var err = new Error(message)
  setPrototypeOf(err, EtaErr.prototype)
  return err
}

EtaErr.prototype = Object.create(Error.prototype, {
  name: { value: 'Eta Error', enumerable: false }
})

export function ParseErr (message: string, str: string, indx: number) {
  var whitespace = str.slice(0, indx).split(/\n/)

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
  throw EtaErr(message)
}
