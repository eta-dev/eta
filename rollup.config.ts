import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'

const pkg = require('./package.json')

// export default {
//   input: `src/index.ts`,
//   output: [
//     { file: pkg.main, format: 'cjs', sourcemap: true },
//     { file: pkg.browser, name: 'Sqrl', format: 'umd', sourcemap: true },
//     { file: pkg.module, format: 'es', sourcemap: true }
//   ],
//   // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
//   external: [],
//   watch: {
//     include: 'src/**'
//   },
//   plugins: [
//     // Allow json resolution
//     // json(),
//     // Compile TypeScript files
//     typescript({ useTsconfigDeclarationDir: true }),

//     // Allow node_modules resolution, so you can use 'external' to control
//     // which external modules to include in the bundle
//     // https://github.com/rollup/rollup-plugin-node-resolve#usage
//     resolve()

//     // Resolve source maps to the original source
//     // sourceMaps()
//   ]
// }

export default [
  {
    input: 'src/browser.ts',
    output: [
      {
        file: 'dist/browser/squirrelly.dev.js',
        format: 'umd',
        name: 'Sqrl',
        sourcemap: true
      },
      {
        file: 'dist/browser/es/squirrelly.dev.js',
        format: 'esm',
        sourcemap: true
      },
      {
        file: pkg.browser,
        format: 'umd',
        name: 'Sqrl',
        sourcemap: true,
        plugins: [terser()]
      },
      {
        file: 'dist/browser/es/squirrelly.min.js',
        format: 'esm',
        sourcemap: true,
        plugins: [terser()]
      }
    ],
    plugins: [json(), typescript({ useTsconfigDeclarationDir: true }), commonjs(), resolve()],
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
    plugins: [json(), typescript({ useTsconfigDeclarationDir: true }), commonjs(), resolve()],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'src/**'
    }
  }
]
