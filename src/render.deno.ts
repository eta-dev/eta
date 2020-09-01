import compile from './compile.ts'
import { getConfig } from './config.ts'

/* TYPES */

import { EtaConfig, PartialConfig } from './config.ts'
import { TemplateFunction } from './compile.ts'
import { CallbackFn } from './file-handlers.ts'

/* END TYPES */

function handleCache(template: string | TemplateFunction, options: EtaConfig): TemplateFunction {
  var templateFunc

  if (options.cache && options.name && options.templates.get(options.name)) {
    return options.templates.get(options.name)
  }

  if (typeof template === 'function') {
    templateFunc = template
  } else {
    templateFunc = compile(template, options)
  }

  if (options.cache && options.name) {
    options.templates.define(options.name, templateFunc)
  }

  return templateFunc
}

export default function render(
  template: string | TemplateFunction,
  data: object,
  env?: PartialConfig,
  cb?: CallbackFn
) {
  var options = getConfig(env || {})

  if (options.async) {
    var result
    if (!cb) {
      // No callback, try returning a promise
      return new Promise(function(resolve: Function, reject: Function) {
        try {
          result = handleCache(template, options)(data, options)
          resolve(result)
        } catch (err) {
          reject(err)
        }
      })
    } else {
      try {
        handleCache(template, options)(data, options, cb)
      } catch (err) {
        return cb(err)
      }
    }
  } else {
    return handleCache(template, options)(data, options)
  }
}
