import { helpers, filters } from './containers'
import { HelperFunction, FilterFunction } from './containers'
import SqrlErr from './err'
import { copyProps } from './utils'

/* TYPES */

export type FetcherFunction = (container: 'H' | 'F', name: string) => Function | undefined

type trimConfig = 'nl' | 'slurp' | boolean

export interface SqrlConfig {
  varName: string
  autoTrim: trimConfig | [trimConfig, trimConfig]
  autoEscape: boolean
  defaultFilter: false | Function
  tags: [string, string]
  l: FetcherFunction
  plugins: { processAST: Array<object>; processFnString: Array<object> }
  async: boolean
  asyncFilters?: Array<string>
  asyncHelpers?: Array<string>
  cache: boolean
  views?: string | Array<string>
  root?: string
  filename?: string
  name?: string
  'view cache'?: boolean
  useWith?: boolean
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
  l: function (container: 'H' | 'F', name: string): HelperFunction | FilterFunction | undefined {
    if (container === 'H') {
      var hRet = helpers.get(name) as HelperFunction | undefined
      if (hRet) {
        return hRet
      } else {
        throw SqrlErr("Can't find helper '" + name + "'")
      }
    } else if (container === 'F') {
      var fRet = filters.get(name) as FilterFunction | undefined
      if (fRet) {
        return fRet
      } else {
        throw SqrlErr("Can't find filter '" + name + "'")
      }
    }
  },
  async: false,
  asyncHelpers: ['include', 'includeFile'],
  cache: false,
  plugins: {
    processAST: [],
    processFnString: []
  },
  useWith: false
}

function getConfig (override: PartialConfig, baseConfig?: SqrlConfig): SqrlConfig {
  // TODO: run more tests on this

  var res: PartialConfig = {} // Linked
  copyProps(res, defaultConfig) // Creates deep clone of res, 1 layer deep

  if (baseConfig) {
    copyProps(res, baseConfig)
  }

  if (override) {
    copyProps(res, override)
  }

  return res as SqrlConfig
}

export { defaultConfig, getConfig }

// Have different envs. Sqrl.render, compile, etc. all use default env
// Use class for env
