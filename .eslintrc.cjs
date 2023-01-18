module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-explicit-any": 1,
    "@typescript-eslint/ban-types": 0, // We need to explicitly use the "Function" type to enable plugins
  },
};
