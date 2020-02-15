// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
export { default as CompileToString, ParseScope, ParseScopeIntoFunction } from './compile-string'
export { default as Compile } from './compile'
export { default as Parse } from './parse'
export { default as Render } from './render'
export { Helpers, NativeHelpers, Filters, Templates } from './containers'
export { defaultConfig, getConfig } from './config'
