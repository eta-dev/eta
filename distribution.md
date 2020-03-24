## The Plan

`dist`

- `eta.cjs.js` -- `main`
- `eta.es.js` -- `module` (don't transpile down to ES5)
- `browser`
  - `eta.umd.js`
  - `eta.umd.min.js` -- `browser`
  - `eta.es.dev.js` (don't transpile)
  - `eta.es.min.js` (don't transpile)

One `index.d.ts` file

Browser will leave out `__express`, filesystem helpers, etc.
