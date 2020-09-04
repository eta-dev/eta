/* Export file stuff */
import { includeFileHelper } from './file-helpers.ts'
import { defaultConfig } from './config.ts'

defaultConfig.includeFile = includeFileHelper
includeFileHelper.bind(defaultConfig)

export { loadFile, renderFile, renderFile as __express } from './file-handlers.ts'

/* End file stuff */

export { default as compileToString } from './compile-string.ts'
export { default as compile } from './compile.ts'
export { default as parse } from './parse.ts'
export { default as render } from './render.ts'
export { templates } from './containers.ts'
export { defaultConfig, defaultConfig as config, getConfig, configure } from './config.ts'
