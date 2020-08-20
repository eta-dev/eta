import { templates } from './containers'
import { copyProps, XMLEscape } from './utils'
import EtaErr from './err'

/* TYPES */

import { TemplateFunction } from './compile'
import { Cacher } from './storage'

type trimConfig = 'nl' | 'slurp' | false

export interface EtaConfig {
  varName: string
  autoTrim: trimConfig | [trimConfig, trimConfig]
  rmWhitespace: boolean
  autoEscape: boolean
  tags: [string, string]
  parse: {
    interpolate: string
    raw: string
    exec: string
  }
  e: (str: string) => string
  plugins: Array<{ processFnString?: Function; processAST?: Function }>
  async: boolean
  templates: Cacher<TemplateFunction>
  cache: boolean
  views?: string | Array<string>
  root?: string
  filename?: string
  name?: string
  'view cache'?: boolean
  useWith?: boolean
  [index: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type PartialConfig = {
  [P in keyof EtaConfig]?: EtaConfig[P]
}

/* END TYPES */

function includeHelper (this: EtaConfig, templateNameOrPath: string, data: object): string {
  var template = this.templates.get(templateNameOrPath)
  if (!template) {
    throw EtaErr('Could not fetch template "' + templateNameOrPath + '"')
  }
  return template(data, this)
}

var defaultConfig: EtaConfig = {
  varName: 'it',
  autoTrim: [false, 'nl'],
  rmWhitespace: false,
  autoEscape: true,
  tags: ['<%', '%>'],
  parse: {
    interpolate: '=',
    raw: '~',
    exec: ''
  },
  async: false,
  templates: templates,
  cache: false,
  plugins: [],
  useWith: false,
  e: XMLEscape,
  include: includeHelper
}

includeHelper.bind(defaultConfig)

function getConfig (override: PartialConfig, baseConfig?: EtaConfig): EtaConfig {
  // TODO: run more tests on this

  var res: PartialConfig = {} // Linked
  copyProps(res, defaultConfig) // Creates deep clone of defaultConfig, 1 layer deep

  if (baseConfig) {
    copyProps(res, baseConfig)
  }

  if (override) {
    copyProps(res, override)
  }

  return res as EtaConfig
}

export { defaultConfig, getConfig }
