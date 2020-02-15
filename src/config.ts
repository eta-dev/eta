import { helpers, filters } from './containers'

/* TYPES */

export type FetcherFunction = (container: 'H' | 'F', name: string) => any

type trimConfig = 'nl' | 'slurp' | boolean

export interface SqrlConfig {
  varName: string
  autoTrim: trimConfig | [trimConfig, trimConfig]
  autoEscape: boolean
  defaultFilter: false | Function
  tags: [string, string]
  l: FetcherFunction
  plugins: { processAST: Array<object>; processFuncString: Array<object> }
  async: boolean
  cache: boolean
  views?: string | Array<string>
  root?: string
  filename?: string
  name?: string
  'view cache'?: boolean
  [index: string]: any
}

export type PartialConfig = {
  [P in keyof SqrlConfig]?: SqrlConfig[P]
}

/* END TYPES */

var defaultConfig: SqrlConfig = {
  varName: 'it',
  autoTrim: [false, 'nl'],
  autoEscape: true,
  defaultFilter: false,
  tags: ['{{', '}}'],
  l: function (container: 'H' | 'F', name: string) {
    if (container === 'H') {
      return helpers.get(name)
    } else if (container === 'F') {
      return filters.get(name)
    }
  },
  async: false,
  cache: false,
  plugins: {
    processAST: [],
    processFuncString: []
  }
}

function getConfig (override: PartialConfig, baseConfig?: SqrlConfig): SqrlConfig {
  var res: SqrlConfig = {
    varName: defaultConfig.varName,
    autoTrim: defaultConfig.autoTrim,
    autoEscape: defaultConfig.autoEscape,
    defaultFilter: defaultConfig.defaultFilter,
    tags: defaultConfig.tags,
    l: defaultConfig.l,
    async: defaultConfig.async,
    cache: defaultConfig.cache,
    plugins: defaultConfig.plugins
  }

  if (baseConfig) {
    for (var key in baseConfig) {
      if (baseConfig.hasOwnProperty(key)) {
        res[key] = baseConfig[key]
      }
    }
  }

  if (override) {
    for (var key in override) {
      if (override.hasOwnProperty(key)) {
        res[key] = override[key]
      }
    }
  }

  return res
}

export { defaultConfig, getConfig }

// Have different envs. Sqrl.render, compile, etc. all use default env
// Use class for env
