/* Export file stuff */
import { includeFileHelper } from './file-helpers.ts'
import { config } from './config.ts'

config.includeFile = includeFileHelper
config.filepathCache = {}

export { loadFile, renderFile, renderFileAsync, renderFile as __express } from './file-handlers.ts'

/* End file stuff */

export { default as compileToString } from './compile-string.ts'
export { default as compile } from './compile.ts'
export { default as parse } from './parse.ts'
export { default as render, renderAsync } from './render.ts'
export { templates } from './containers.ts'
export { config, config as defaultConfig, getConfig, configure } from './config.ts'
