import { Helpers, Templates, Filters } from './containers'
import SqrlErr from './err'

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

export type PartialConfig = {
  [P in keyof SqrlConfig]?: SqrlConfig[P]
}

function Config (newConfig: PartialConfig, name?: string): SqrlConfig {
  // TODO:
  // Double-check this is performant, doesn't cause errors

  var conf: SqrlConfig = returnDefaultConfig()

  for (var attrname in newConfig) {
    conf[attrname] = newConfig[attrname]
  }

  if (name) {
    Env[name] = conf as SqrlConfig
  }
  return conf as SqrlConfig
}

function getConfig (conf: string | PartialConfig): SqrlConfig {
  if (typeof conf === 'string') {
    return Env[conf]
  } else if (typeof conf === 'object') {
    return Config(conf)
  } else {
    throw SqrlErr('Env reference cannot be of type: ' + typeof conf)
  }
}

function returnDefaultConfig (): SqrlConfig {
  return {
    varName: 'it',
    autoTrim: false,
    autoEscape: true,
    defaultFilter: false,
    tags: ['{{', '}}'],
    loadFunction: function (container: 'H' | 'F', name: string) {
      if (container === 'H') {
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
}

var Env: Dict = {
  default: returnDefaultConfig()
}

export { Env, Config, getConfig }

// Have different envs. Sqrl.Render, Compile, etc. all use default env
// Use class for env
