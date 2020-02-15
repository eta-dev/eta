import compileToString from './compile-string'
import { getConfig } from './config'

/* TYPES */

import { SqrlConfig, PartialConfig } from './config'
export type TemplateFunction = (data: object, config: SqrlConfig) => string

/* END TYPES */

export default function compile (str: string, env?: PartialConfig): TemplateFunction {
  var options: SqrlConfig = getConfig(env || {})
  var ctor // constructor

  /* ASYNC HANDLING */
  // The below code is modified from mde/ejs. All credit should go to them.
  if (options.async) {
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
    options.varName,
    'c', // SqrlConfig
    compileToString(str, options)
  ) as TemplateFunction // eslint-disable-line no-new-func
}

// console.log(Compile('hi {{this}} hey', '{{', '}}').toString())
