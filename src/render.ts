import Compile from './compile'
import SqrlErr from './err'
import { Env, PartialConfig, getConfig } from './config'

type TemplateFunction = (data: object, fetcher: Function) => string
type DetermineEnvFunction = (options?: object) => string | PartialConfig

function Render (
  template: string | TemplateFunction,
  data: object,
  env?: string | DetermineEnvFunction | PartialConfig,
  options?: object
) {
  var Config = Env.default
  if (env) {
    if (typeof env === 'function') {
      env = env(options) // this can be used to dynamically pick an env based on name, etc.
    }

    Config = getConfig(env)
  }
  if (typeof template === 'function') {
    return template(data, Config.loadFunction)
  }
  // else
  var templateFunc = Compile(template, Config)
  return templateFunc(data, Config.loadFunction)
}

export default Render
