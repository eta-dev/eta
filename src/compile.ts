import compileToString from './compile-string'
import { getConfig } from './config'
import EtaErr from './err'

/* TYPES */

import { EtaConfig, PartialConfig } from './config'
import { CallbackFn } from './file-handlers'
export type TemplateFunction = (data: object, config: EtaConfig, cb?: CallbackFn) => string

/* END TYPES */

export default function compile (str: string, env?: PartialConfig): TemplateFunction {
  var options: EtaConfig = getConfig(env || {})
  var ctor // constructor

  /* ASYNC HANDLING */
  // The below code is modified from mde/ejs. All credit should go to them.
  if (options.async) {
    // Have to use generated function for this, since in envs without support,
    // it breaks in parsing
    try {
      ctor = new Function('return (async function(){}).constructor')()
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw EtaErr("This environment doesn't support async/await")
      } else {
        throw e
      }
    }
  } else {
    ctor = Function
  }
  /* END ASYNC HANDLING */
  try {
    return new ctor(
      options.varName,
      'E', // EtaConfig
      'cb', // optional callback
      compileToString(str, options)
    ) as TemplateFunction // eslint-disable-line no-new-func
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw EtaErr(
        'Bad template syntax\n\n' +
          e.message +
          '\n' +
          Array(e.message.length + 1).join('=') +
          '\n' +
          compileToString(str, options)
      )
    } else {
      throw e
    }
  }
}
