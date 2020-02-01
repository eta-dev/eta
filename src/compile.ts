import CompileToString from './compile-string'
import { Env, SqrlConfig, getConfig } from './config'

type TemplateFunction = (data: object, fetcher: Function) => string

function Compile (str: string, env?: string | SqrlConfig): TemplateFunction {
  var SqrlEnv: SqrlConfig = Env.default
  var ctor // constructor
  if (env) {
    SqrlEnv = getConfig(env)
  }
  /* ASYNC HANDLING */
  // The below code is modified from mde/ejs. All credit should go to them.
  if (SqrlEnv.async) {
    // Have to use generated function for this, since in envs without support,
    // it breaks in parsing
    try {
      ctor = new Function('return (async function(){}).constructor;')()
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error('This environment does not support async/await')
      } else {
        throw e
      }
    }
  } else {
    ctor = Function
  }
  /* END ASYNC HANDLING */
  return new ctor(
    SqrlEnv.varName,
    'l', // this fetches helpers, partials, etc.
    CompileToString(str, SqrlEnv)
  ) as TemplateFunction // eslint-disable-line no-new-func
}

export default Compile
// console.log(Compile('hi {{this}} hey', '{{', '}}').toString())
