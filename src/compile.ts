import CompileToString from './compile-string'
import { Env } from './config'

function Compile (str: string, tagOpen: string, tagClose: string, envName: string) {
  var SqrlEnv = Env.get(envName || 'default')
  return new Function(SqrlEnv.varName, 'Sqrl', CompileToString(str, tagOpen, tagClose, SqrlEnv)) // eslint-disable-line no-new-func
}

export default Compile
// console.log(Compile('hi {{this}} hey', '{{', '}}').toString())
