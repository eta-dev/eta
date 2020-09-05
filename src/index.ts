// @denoify-ignore

/* Export file stuff */
import { includeFileHelper } from './file-helpers'
import { config } from './config'

config.includeFile = includeFileHelper
includeFileHelper.bind(config)

export { loadFile, renderFile, renderFile as __express } from './file-handlers'

/* End file stuff */

export { default as compileToString } from './compile-string'
export { default as compile } from './compile'
export { default as parse } from './parse'
export { default as render } from './render'
export { templates } from './containers'
export { config, config as defaultConfig, getConfig, configure } from './config'
