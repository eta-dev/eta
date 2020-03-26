# eta (η)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[logo]: https://img.shields.io/badge/all_contributors-3-orange.svg 'Number of contributors on All-Contributors'

<!-- ALL-CONTRIBUTORS-BADGE:END -->

![GitHub package.json version (master)](https://img.shields.io/github/package-json/v/nebrelbug/eta/master?label=current%20version)
[![Travis](https://img.shields.io/travis/com/nebrelbug/eta/master.svg)](https://travis-ci.com/nebrelbug/eta)
[![All Contributors][logo]](#contributors-)
[![Coveralls](https://img.shields.io/coveralls/nebrelbug/eta.svg)](https://coveralls.io/github/nebrelbug/eta)
[![Dev Dependencies](https://img.shields.io/david/dev/nebrelbug/eta)](https://david-dm.org/nebrelbug/eta?type=dev)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Join the chat at https://gitter.im/eta-js/community](https://img.shields.io/gitter/room/nebrelbug/eta?color=%2346BC99)](https://gitter.im/eta-js/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/bengubler)

**Summary**

Eta is a lightweight and blazing fast embedded JS templating engine. The team who created Squirrelly created it to serve as a better alternative to EJS.

## Eta vs EJS

Eta's syntax is very similar to EJS' (most templates should work with either engine), Eta has a similar API, and Eta and EJS share the same file-handling logic. Here are the differences between Eta and EJS:

- Eta is more lightweight. Eta weighs less than **2KB gzipped**, while EJS is **4.4KB gzipped**
- Eta compiles and renders templates **_much_ faster than EJS**. Check out these benchmarks: https://cdn.statically.io/gh/nebrelbug/eta/master/browser-tests/benchmark.html
- Eta allows left whitespace control (with `-`), something that doesn't work in EJS because EJS uses `-` on the left side to indicate that the value shouldn't be escaped. Instead, Eta uses `~` to output a raw value
- Eta gives you more flexibility with delimeters -- you could set them to `{{` and `}}`, for example, while with EJS this isn't possible
- Eta adds plugin support
- Comments in Eta use `/* ... */` which allows commenting around template tags
- Eta parses strings correctly. _Example: `<%= "%>" %>` works in Eta, while it breaks in EJS_
- Eta exposes Typescript types and distributes a UMD build
- Custom tag-type indicators. _Example: you could change `<%=` to `<%*`_

## Why Eta?

Simply put, Eta is super: super lightweight, super fast, super powerful, and super simple. Like with EJS, you don't have to worry about learning an entire new templating syntax. Just write JavaScript inside your templates.

### Where did Eta's name come from?

"Eta" means tiny in Esperanto. Plus, it can be used as an acronym for all sorts of cool phrases: "ECMAScript Template Awesomeness", "Embedded Templating Alternative", etc...

### 🌟 Features

- 🔧 Great error reporting
- 📦 0 dependencies
- 🔧 Better quotes/comments support
  - _ex. `<%= someval + "string %>" %>`_ compiles correctly, while it fails with doT or EJS
- ⚡️ Exports ES Modules as well as UMD
- 🔧 ExpressJS support out-of-the-box
- 🔨 Loops
- 🔧 Custom delimeters
- 📝 Easy template syntax
- 🔧 Precompilation
- 🔨 Partials
- 🔨 Comments
- 🔨 Server and browser support
- 🔧 Caching
- 🚀 Super Fast
  - Check out [these benchmarks](https://cdn.statically.io/gh/nebrelbug/eta/master/browser-tests/benchmark.html)
- ⚡️ Async support

## 📜 Docs

A documentation website is coming soon. In the meantime

## 📓 Examples

### Simple Template

```
var myTemplate = "<p>My favorite kind of cake is: <%= it.favoriteCake %></p>"

Eta.render(myTemplate, {favoriteCake: 'Chocolate!'})
// Returns: '<p>My favorite kind of cake is: Chocolate!</p>
```

### Conditionals

```
<% if(it.somevalue === 1) { %>
Display this
<% } else { %>
Display this instead
<% } %>
```

### Loops

```
<ul>
<% it.users.forEach(function(user){ %>
<li><%= user.name %></li>
<% }) %>
</ul>
```

## ✔️ Tests

Tests can be run with `npm test`. Multiple tests check that parsing, rendering, and compiling return expected results, formatting follows guidelines, and code coverage is at the expected level.

## Resources

To be added

## Projects using `eta`

[Add yours!](https://github.com/nebrelbug/eta/edit/master/README.md)

## Contributors

Made with ❤ by [@nebrelbug](https://github.com/nebrelbug) and all these wonderful contributors ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.bengubler.com"><img src="https://avatars3.githubusercontent.com/u/25597854?v=4" width="100px;" alt=""/><br /><sub><b>Ben Gubler</b></sub></a><br /><a href="https://github.com/nebrelbug/eta/commits?author=nebrelbug" title="Code">💻</a> <a href="#question-nebrelbug" title="Answering Questions">💬</a> <a href="https://github.com/nebrelbug/eta/commits?author=nebrelbug" title="Documentation">📖</a> <a href="https://github.com/nebrelbug/eta/commits?author=nebrelbug" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://ducnhatphung@gmail.com"><img src="https://avatars1.githubusercontent.com/u/16368559?v=4" width="100px;" alt=""/><br /><sub><b>Clite Tailor</b></sub></a><br /><a href="#ideas-clitetailor" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/nebrelbug/eta/commits?author=clitetailor" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/ioan_chiriac"><img src="https://avatars2.githubusercontent.com/u/173203?v=4" width="100px;" alt=""/><br /><sub><b>Ioan CHIRIAC</b></sub></a><br /><a href="https://github.com/nebrelbug/eta/commits?author=ichiriac" title="Code">💻</a> <a href="#ideas-ichiriac" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!

## Credits

- Async support and file handling were added based on code from [EJS](https://github.com/mde/ejs), which is licensed under the Apache-2.0 license. Code was modified to throw a Squirrelly Error.
- Syntax and some parts of compilation are heavily based off EJS, Nunjucks, and doT.
