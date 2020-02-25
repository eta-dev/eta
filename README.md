<a href="https://squirrelly.js.org"><img src="https://cdn.jsdelivr.net/gh/squirrellyjs/squirrelly-logo/svg-minified/squirrelly-fit-acorn.svg" align="right" width="30%" alt="Squirrel"></a>

# squirrelly

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[logo]: https://img.shields.io/badge/all_contributors-3-orange.svg 'Number of contributors on All-Contributors'
<!-- ALL-CONTRIBUTORS-BADGE:END -->

![GitHub package.json version (master)](https://img.shields.io/github/package-json/v/squirrellyjs/squirrelly/master?label=current%20version)
[![Travis](https://img.shields.io/travis/com/squirrellyjs/squirrelly/master.svg)](https://travis-ci.com/squirrellyjs/squirrelly)
[![All Contributors][logo]](#contributors-)
[![Coveralls](https://img.shields.io/coveralls/squirrellyjs/squirrelly.svg)](https://coveralls.io/github/squirrellyjs/squirrelly)
[![Dev Dependencies](https://img.shields.io/david/dev/squirrellyjs/squirrelly)](https://david-dm.org/squirrellyjs/squirrelly?type=dev)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/squirrellyjs/squirrelly.svg)](https://greenkeeper.io/)
[![Join the chat at https://gitter.im/squirrellyjs/Lobby](https://img.shields.io/gitter/room/squirrellyjs/squirrelly?color=%2346BC99)](https://gitter.im/squirrellyjs/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/bengubler)

**Summary**

Squirrelly is a modern, configurable, and blazing fast template engine implemented in JavaScript. It works out of the box with ExpressJS and the **full version** weighs only **~3.3KB gzipped**.

**This is version 8** - a new, more powerful rewrite of Squirrelly. It adds multiple features (like filter parameters, whitespace control, partials, and template inheritance) to bring you a template engine with the power of Nunjucks, the simplicity of EJS, and the small bundle size of its earlier versions.

Version 8 is still in beta. Squirrelly v7 will continue to be maintained, and can be found at https://github.com/squirrellyjs/squirrelly/tree/v7. Since the API of v8 isn't fully documented yet, most people should probably use v7 for the next few weeks.

[Read about the changes](https://squirrelly.js.org/blog/squirrelly-version-8)

## Why Squirrelly?

Simply put, Squirrelly is super lightweight, super fast, super powerful, and super simple.

### 🌟 Features

- 🔧 Helpers, filters
- 🔧 Great error reporting
- 📦 0 dependencies
- 🔨 Conditionals
- 🔧 Better quotes/comments support
  - _ex. `{{someval + "name }}" }}`_ compiles correctly, while it fails with DoT or EJS
- ⚡️ Exports ES Modules as well as UMD
- 🔨 Loops
- 🔧 Custom delimeters
- 📝 Easy template syntax
- 🔧 Precompilation
- 🔨 Partials
- 🔧 Inline JavaScript
- 🔨 Comments
- 🔧 Caching
- 🚀 Fast
- ⚡️ Async support: async filters, helpers, partials
- 🔧 Template inheritance

## 📜 Docs

We know nobody reads through the long and boring documentation in the ReadMe anyway, so head over to the documentation website:

📝 [https://squirrelly.js.org](https://squirrelly.js.org)

## 📓 Examples

### Simple Template

```
var myTemplate = "<p>My favorite kind of cake is: {{it.favoriteCake}}</p>"

Sqrl.render(myTemplate, {favoriteCake: 'Chocolate!'})
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

## ✔️ Tests

Tests can be run with `npm test`. Multiple tests check that parsing, rendering, and compiling return expected results, formatting follows guidelines, and code coverage is at the expected level.

## Resources

To be added

## Projects using `squirrelly`

[Waiting for permissions]

## Contributors

Made with ❤ by [@nebrelbug](https://github.com/nebrelbug) and all these wonderful contributors ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.bengubler.com"><img src="https://avatars3.githubusercontent.com/u/25597854?v=4" width="100px;" alt=""/><br /><sub><b>Ben Gubler</b></sub></a><br /><a href="https://github.com/squirrellyjs/squirrelly/commits?author=nebrelbug" title="Code">💻</a> <a href="#question-nebrelbug" title="Answering Questions">💬</a> <a href="https://github.com/squirrellyjs/squirrelly/commits?author=nebrelbug" title="Documentation">📖</a> <a href="https://github.com/squirrellyjs/squirrelly/commits?author=nebrelbug" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://ducnhatphung@gmail.com"><img src="https://avatars1.githubusercontent.com/u/16368559?v=4" width="100px;" alt=""/><br /><sub><b>Clite Tailor</b></sub></a><br /><a href="#ideas-clitetailor" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/squirrellyjs/squirrelly/commits?author=clitetailor" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/ioan_chiriac"><img src="https://avatars2.githubusercontent.com/u/173203?v=4" width="100px;" alt=""/><br /><sub><b>Ioan CHIRIAC</b></sub></a><br /><a href="https://github.com/squirrellyjs/squirrelly/commits?author=ichiriac" title="Code">💻</a> <a href="#ideas-ichiriac" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!

## Credits

- Async support and file handling were added based on code from [EJS](https://github.com/mde/ejs), which is licensed under the Apache-2.0 license. Code was modified to throw a Squirrelly Error.
