module.exports = {
  env: {
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint'
  ],
  ignorePatterns: [
    'node_modules',
    'dist',
    'deno_dist',
    'src/*.deno.ts',
    'coverage',
    'browser-tests',
    'tools',
    'rollup.config.ts'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-var': 0,
    '@typescript-eslint/no-var-requires': 0,
    'prefer-const': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/ban-types': 0 // Otherwise TS won't let us use Function and object
  },
  settings: {}
}
