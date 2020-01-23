import CompileToString from './compile-string'
import { Env, SqrlConfig, getConfig } from './config'

function Compile (str: string, env?: string | SqrlConfig) {
  var SqrlEnv: SqrlConfig = Env.default
  if (env) {
    SqrlEnv = getConfig(env)
  }

  return new Function(
    SqrlEnv.varName,
    'l', // this fetches helpers, partials, etc.
    CompileToString(str, SqrlEnv)
  ) // eslint-disable-line no-new-func
}

export default Compile
// console.log(Compile('hi {{this}} hey', '{{', '}}').toString())
