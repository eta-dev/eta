import Compile from './compile'
import SqrlErr from './err'
import { Env, SqrlConfig } from './config'

type TemplateFunction = (data: object, fetcher: Function) => string
type DetermineEnvFunction = (options?: object) => string

function Render (
  template: string | TemplateFunction,
  data: object,
  env?: string | DetermineEnvFunction,
  options?: object
) {
  var Config = Env.get('default')
  if (typeof env === 'function') {
    env = env(options) // this can be used to dynamically pick an env based on name, etc.
  }

  if (typeof env === 'object') {
    Config = env
  } else if (typeof env === 'string' && env.length) {
    Config = Env.get(env)
  }

  if (typeof template === 'function') {
    return template(data, Config.loadFunction)
  }
  // else
  var templateFunc = Compile(template, Config)
  return templateFunc(data, Config.loadFunction)
}

export default Render
