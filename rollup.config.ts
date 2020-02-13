import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
// import json from 'rollup-plugin-json' // shouldn't need this. Was first in plugins
import { terser } from 'rollup-plugin-terser'
// import { sizeSnapshot } from 'rollup-plugin-size-snapshot' // possibly add this

// TODO: Someday don't transpile ES6 module dist files to ES5, ex. removing classes
const pkg = require('./package.json')

export default [
  {
    input: 'src/browser.ts', // todo: use rollup-plugin-replace
    output: [
      {
        file: 'dist/browser/squirrelly.dev.js',
        format: 'umd',
        name: 'Sqrl',
        sourcemap: true
      },
      {
        file: pkg.browser,
        format: 'umd',
        name: 'Sqrl',
        sourcemap: true,
        plugins: [terser()]
      }
    ],
    plugins: [typescript({ useTsconfigDeclarationDir: true }), commonjs(), resolve()],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'src/**'
    }
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [typescript({ useTsconfigDeclarationDir: true }), commonjs(), resolve()],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'src/**'
    }
  }
]
