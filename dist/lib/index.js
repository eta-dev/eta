// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
export { default as CompileToString, ParseScope, ParseScopeIntoFunction } from './compile-string';
export { default as Compile } from './compile';
export { default as Parse } from './parse';
export { default as Render } from './render';
export { Helpers as H, NativeHelpers as NH, Filters as F, Partials as P, Layouts as L } from './containers';
export { Config } from './config';
// TODO: Allow for configuring different Squirrelly environments
//       Don't require it like Nunjucks though. Keep it simple
//# sourceMappingURL=index.js.map