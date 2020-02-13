import CompileToString from './compile-string'
import { getConfig, SqrlConfig, PartialConfig } from './config'

export type TemplateFunction = (data: object, config: SqrlConfig) => string

function Compile (str: string, env?: PartialConfig): TemplateFunction {
  var Options: SqrlConfig = getConfig(env || {})
  var ctor // constructor

  /* ASYNC HANDLING */
  // The below code is modified from mde/ejs. All credit should go to them.
  if (Options.async) {
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
    Options.varName,
    'c', // SqrlConfig
    CompileToString(str, Options)
  ) as TemplateFunction // eslint-disable-line no-new-func
}

export default Compile
// console.log(Compile('hi {{this}} hey', '{{', '}}').toString())
