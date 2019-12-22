import CompileToString from './compile-string'

function Compile (str: string, tagOpen: string, tagClose: string) {
  return new Function('it', 'Sqrl', CompileToString(str, tagOpen, tagClose)) // eslint-disable-line no-new-func
}

export default Compile
// console.log(Compile('hi {{this}} hey', '{{', '}}').toString())
