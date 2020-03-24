/* Export file stuff */
import { includeFileHelper } from './file-helpers'

/* TYPES */

/* END TYPES */

// helpers.define('includeFile', includeFileHelper as HelperFunction)
// helpers.define('extendsFile', extendsFileHelper as HelperFunction)

export { renderFile, renderFile as __express } from './file-handlers'
export { loadFile } from './file-utils'

/* End file stuff */

export { default as compileToString } from './compile-string'
export { default as compile } from './compile'
export { default as parse } from './parse'
export { default as render } from './render'
export { templates } from './containers'
export { defaultConfig, getConfig } from './config'
