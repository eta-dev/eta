import { helpers, filters } from './containers'
import { HelperFunction, FilterFunction } from './containers'
import SqrlErr from './err'

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
  l: function (container: 'H' | 'F', name: string) {
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

function copyProps (toObj: PartialConfig, fromObj: PartialConfig) {
  for (var key in fromObj) {
    if (fromObj.hasOwnProperty(key)) {
      toObj[key] = fromObj[key]
    }
  }
}

function getConfig (override: PartialConfig, baseConfig?: SqrlConfig): SqrlConfig {
  // TODO: check speed on this vs for-in loop

  // var res: SqrlConfig = {
  //   varName: defaultConfig.varName,
  //   autoTrim: defaultConfig.autoTrim,
  //   autoEscape: defaultConfig.autoEscape,
  //   defaultFilter: defaultConfig.defaultFilter,
  //   tags: defaultConfig.tags,
  //   l: defaultConfig.l,
  //   plugins: defaultConfig.plugins,
  //   async: defaultConfig.async,
  //   asyncFilters: defaultConfig.asyncFilters,
  //   asyncHelpers: defaultConfig.asyncHelpers,
  //   cache: defaultConfig.cache,
  //   views: defaultConfig.views,
  //   root: defaultConfig.root,
  //   filename: defaultConfig.filename,
  //   name: defaultConfig.name,
  //   'view cache': defaultConfig['view cache'],
  //   useWith: defaultConfig.useWith
  // }

  var res: PartialConfig = {} // Linked
  copyProps(res, defaultConfig) // Creates deep clone of res, 1 layer deep

  if (baseConfig) {
    // for (var key in baseConfig) {
    //   if (baseConfig.hasOwnProperty(key)) {
    //     res[key] = baseConfig[key]
    //   }
    // }
    copyProps(res, baseConfig)
  }

  if (override) {
    // for (var overrideKey in override) {
    //   if (override.hasOwnProperty(overrideKey)) {
    //     res[overrideKey] = override[overrideKey]
    //   }
    // }
    copyProps(res, override)
  }

  return res as SqrlConfig
}

export { defaultConfig, getConfig }

// Have different envs. Sqrl.render, compile, etc. all use default env
// Use class for env
