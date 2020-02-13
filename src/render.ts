import Compile from './compile'
import { getConfig, SqrlConfig, PartialConfig } from './config'
import { Templates } from './containers'

type TemplateFunction = (data: object, config: SqrlConfig) => string
type CallbackFn = (err: Error | null, str?: string) => void

function Render (template: string | TemplateFunction, data: object, env?: PartialConfig) {
  var Options = getConfig(env || {})
  var templateFunc

  if (Options.cache && Options.name && Templates.get(Options.name)) {
    return Templates.get(Options.name)(data, Options)
  }

  if (typeof template === 'function') {
    templateFunc = template
  } else {
    templateFunc = Compile(template, Options)
  }

  if (Options.cache && Options.name) {
    Templates.define(Options.name, templateFunc)
  }

  return templateFunc(data, Options)
}

export default Render
