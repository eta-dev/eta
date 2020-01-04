import Compile from './compile'
import { Helpers, Filters } from './containers'

type TemplateFunction = (data: object, Sqrl: object) => string
type DetermineEnvFunction = (options?: object) => string

function Render (
  template: string | TemplateFunction,
  data: object,
  env?: string | DetermineEnvFunction,
  options?: object
) {
  if (!env) {
    env = 'default'
  } else if (typeof env === 'function') {
    env = env(options) // this can be used to dynamically pick an env based on name, etc.
  }

  if (typeof template === 'function') {
    return template(data, { H: Helpers, F: Filters })
  }
  // else
  var templateFunc = Compile(template, '{{', '}}', env)
  return templateFunc(data, { H: Helpers, F: Filters })
}

export default Render
