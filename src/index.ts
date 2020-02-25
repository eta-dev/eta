/* Export file stuff */
import { helpers } from './containers'
import { includeFileHelper, extendsFileHelper } from './file-helpers'

/* TYPES */

import { HelperFunction } from './containers'

/* END TYPES */

helpers.define('includeFile', includeFileHelper as HelperFunction)
helpers.define('extendsFile', extendsFileHelper as HelperFunction)

export { renderFile, renderFile as __express } from './file-handlers'
export { loadFile } from './file-utils'

/* End file stuff */

export {
  default as compileToString,
  compileScope,
  compileScopeIntoFunction
} from './compile-string'
export { default as compile } from './compile'
export { default as parse } from './parse'
export { default as render } from './render'
export { helpers, nativeHelpers, filters, templates } from './containers'
export { defaultConfig, getConfig } from './config'
