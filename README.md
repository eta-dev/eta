<a href="https://squirrelly.js.org"><img src="https://cdn.jsdelivr.net/gh/squirrellyjs/squirrelly-logo@1.0/svg-minified/squirrelly-fit-acorn.svg" align="right" width="30%" alt="Squirrel"></a>

# squirrelly

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://img.shields.io/badge/Greenkeeper-enabled-brightgreen)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/squirrellyjs/squirrelly-next.svg)](https://travis-ci.org/squirrellyjs/squirrelly-next)
[![Coveralls](https://img.shields.io/coveralls/squirrellyjs/squirrelly-next.svg)](https://coveralls.io/github/squirrellyjs/squirrelly-next)
[![Dev Dependencies](https://img.shields.io/david/dev/squirrellyjs/squirrelly-next)](https://david-dm.org/squirrellyjs/squirrelly-next?type=dev)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/bengubler)

<!--Add all-contributors-->

**Summary**

Squirrelly is a modern, configurable, and blazing fast template engine implemented in JavaScript. It works out of the box with ExpressJS and the **full version** weighs only **~2.2KB gzipped**.

This is version 8 - a new, more powerful rewrite of Squirrelly. It adds multiple features (like filter parameters, whitespace control, partials, and template inheritance) to bring you a template engine with the power of Nunjucks, the simplicity of EJS, and the small bundle size of its earlier versions.

[Read about why we decided to develop in a separate repository]

[learn about the changes]

## Why Squirrelly?

Simply put, Squirrelly is super lightweight, super fast, super powerful, and super simple.

### 🌟 Features

- &#128295; Custom helpers
- &#128295; Custom filters
- :package: 0 dependencies
- :hammer: Conditionals
- :zap: Exports ES Modules as well as UMD
- :hammer: Loops
- &#128295; Custom delimeters
- :pencil2: Easy template syntax
- &#128295; Precompilation
- :hammer: Partials
- &#128295; Inline JavaScript
- :hammer: Comments
- &#128295; Caching
- :rocket: SUPER fast (look at the performance benchmarks [here](https://github.com/nebrelbug/squirrelly-benchmarks))

## :scroll: Docs

We know nobody reads through the long and boring documentation in the ReadMe anyway, so head over to the documentation website:

:pencil: [https://squirrelly.js.org](https://squirrelly.js.org)

## :notebook: Examples

### Simple Template

```
var myTemplate = "<p>My favorite kind of cake is: {{it.favoriteCake}}</p>"

Sqrl.Render(myTemplate, {favoriteCake: 'Chocolate!'})
// Returns: '<p>My favorite kind of cake is: Chocolate!</p>
```

### Conditionals

```
{{~if(it.somevalue === 1)}}
Display this
{{#else}}
Display this
{{/if}}
```

### Loops

```
{{~each(it.somearray) => val, index}}
Display this
The current array element is {{val}}
The current index is {{index}}
{{/each}}
```

## :heavy_check_mark: Tests

Tests can be run with `npm test`. Multiple tests check that parsing, rendering, and compiling return expected results, formatting follows guidelines, and code coverage is at the expected level.

## Resources

To be added

## Projects using `squirrelly`

[Waiting for permissions]

## Credits

Made with :heart: by [@nebrelbug](https://github.com/nebrelbug) and all these wonderful contributors ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
