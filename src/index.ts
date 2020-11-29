// @denoify-ignore

/* Export file stuff */
import { includeFileHelper } from './file-helpers'
import { config } from './config'

config.includeFile = includeFileHelper
config.filepathCache = {}

export { loadFile, renderFile, renderFileAsync, renderFile as __express } from './file-handlers'

/* End file stuff */

export { default as compileToString } from './compile-string'
export { default as compile } from './compile'
export { default as parse } from './parse'
export { default as render, renderAsync } from './render'
export { templates } from './containers'
export { config, config as defaultConfig, getConfig, configure } from './config'
