// TODO: allow importing polyfills?
// import "core-js/fn/array.find"
// ...

import { Helpers, HelperFunction } from './containers'
import { includeHelper, includeFileHelper } from './file-helpers'
Helpers.define('include', includeHelper as HelperFunction)
Helpers.define('includeFile', includeFileHelper as HelperFunction)
export { renderFile, renderFile as __express } from './file-handlers'
export { loadFile } from './file-utils'

export { default as CompileToString, ParseScope, ParseScopeIntoFunction } from './compile-string'
export { default as Compile } from './compile'
export { default as Parse } from './parse'
export { default as Render } from './render'
export { Helpers, NativeHelpers, Filters, Templates } from './containers'
export { defaultConfig, getConfig } from './config'
