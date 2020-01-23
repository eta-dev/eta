import { Helpers, Templates, Filters } from './containers'

interface Dict {
  [key: string]: SqrlConfig
}

export interface SqrlConfig {
  varName: string
  autoTrim: boolean | 'nl'
  autoEscape: boolean
  defaultFilter: false | Function
  tags: [string, string]
  loadFunction: Function
  plugins: { processAST: Array<object>; processFuncString: Array<object> }
  [index: string]: any
}

type PartialConfig = {
  [P in keyof SqrlConfig]?: SqrlConfig[P]
}

function Config (newConfig: PartialConfig, name?: string): SqrlConfig {
  var conf = Env.default
  for (var attrname in newConfig) {
    conf[attrname] = newConfig[attrname]
  }
  if (name) {
    Env[name] = conf
  }
  return conf
}

var defaultConfig: SqrlConfig = {
  varName: 'it',
  autoTrim: false,
  autoEscape: true,
  defaultFilter: false,
  tags: ['{{', '}}'],
  loadFunction: function (container: 'T' | 'H' | 'F', name: string) {
    if (container === 'T') {
      return Templates.get(name)
    } else if (container === 'H') {
      return Helpers.get(name)
    } else if (container === 'F') {
      return Filters.get(name)
    }
  },
  plugins: {
    processAST: [],
    processFuncString: []
  }
}

var Env: Dict = {
  default: defaultConfig
}

export { Env, Config }

// Have different envs. Sqrl.Render, Compile, etc. all use default env
// Use class for env
