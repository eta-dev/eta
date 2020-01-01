## The Plan

`dist`

- `squirrelly.cjs.js` -- `main`
- `squirrelly.es.js` -- `module` (don't transpile down to ES5)
- `browser`
  - `squirrelly.umd.js`
  - `squirrelly.umd.min.js` -- `browser`
  - `squirrelly.es.dev.js` (don't transpile)
  - `squirrelly.es.min.js` (don't transpile)

One `index.d.ts` file

Browser will leave out `__express`, filesystem helpers, etc.
