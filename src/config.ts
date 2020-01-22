import { Helpers, Templates, Filters } from './containers'

interface Dict {
  [key: string]: SqrlConfig
}

interface IEnv {
  cache: Dict
  define: (key: string, val: SqrlConfig) => void
  get: (key: string) => SqrlConfig
  remove: (key: string) => void
  clear: () => void
  load: (cacheObj: Dict) => void
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

var Env: IEnv = {
  cache: {
    default: defaultConfig
  },
  define: function (key: string, newConfig: PartialConfig) {
    if (!this.cache[key]) {
      this.cache[key] = defaultConfig
    }
    for (var attrname in newConfig) {
      this.cache[key][attrname] = newConfig[attrname]
    }
  },
  get: function (key: string) {
    // string | array.
    // TODO: allow array of keys to look down
    return this.cache[key]
  },
  remove: function (key: string) {
    delete this.cache[key]
  },
  clear: function () {
    this.cache = {}
  },
  load: function (cacheObj: Dict) {
    this.cache = cacheObj
  }
}

export { Env }

// Have different envs. Sqrl.Render, Compile, etc. all use default env
// Use class for env
