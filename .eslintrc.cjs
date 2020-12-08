module.exports = {
  extends: ["eta-dev"],
  rules: {
    "prefer-rest-params": "warn" // because ts injected polyfills bloat bundle size
  }
}
