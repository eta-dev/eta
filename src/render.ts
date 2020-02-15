import Compile from './compile'
import { getConfig } from './config'
import { templates } from './containers'

/* TYPES */

import { SqrlConfig, PartialConfig } from './config'
import { TemplateFunction } from './compile'
type CallbackFn = (err: Error | null, str?: string) => void

/* END TYPES */

function Render (template: string | TemplateFunction, data: object, env?: PartialConfig) {
  var options = getConfig(env || {})
  var templateFunc

  if (options.cache && options.name && templates.get(options.name)) {
    return templates.get(options.name)(data, options)
  }

  if (typeof template === 'function') {
    templateFunc = template
  } else {
    templateFunc = Compile(template, options)
  }

  if (options.cache && options.name) {
    templates.define(options.name, templateFunc)
  }

  return templateFunc(data, options)
}

export default Render
