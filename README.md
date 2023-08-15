<p align="center">
  <img align="center" width="50%" src="https://github.com/eta-dev/eta/assets/25597854/041dbe34-883b-459b-8607-c787815c441a">
</p>

<h1 align="center" style="text-align: center; width: fit-content; margin-left: auto; margin-right: auto;">eta (η)</h1>

<p align="center">
  <a href="https://eta.js.org">Documentation</a> -
  <a href="https://discord.gg/27gGncJYE2">Chat</a> -
  <a href="https://runkit.com/nebrelbug/eta-v3">RunKit Demo</a> -
  <a href="https://eta.js.org/playground">Playground</a>
</p>

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[logo]: https://img.shields.io/badge/all_contributors-10-orange.svg "Number of contributors on All-Contributors"

<!-- ALL-CONTRIBUTORS-BADGE:END -->

<span align="center">

[![GitHub package.json version (main)](https://img.shields.io/github/package-json/v/eta-dev/eta/main?label=current%20version)](https://www.npmjs.com/package/eta)
[![GitHub Actions Status](https://github.com/eta-dev/eta/actions/workflows/test.yml/badge.svg)](https://github.com/eta-dev/eta/actions)
[![All Contributors][logo]](#contributors-)
[![Coveralls](https://img.shields.io/coveralls/eta-dev/eta.svg?branch=main)](https://coveralls.io/github/eta-dev/eta?branch=main)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/bengubler)

</span>

<span align="center">

**You're viewing the source for Eta v3, which we just released! For v2, visit [the old branch](https://github.com/eta-dev/eta/tree/v2).**

</span>

## Summary

Eta is a lightweight and blazing fast embedded JS templating engine that works inside Node, Deno, and the browser. It's written in TypeScript and emphasizes great performance, configurability, and small bundle size.

### 🌟 Features

- 📦 0 dependencies
- 💡 Only ~3.5 KB minzipped
- ⚡️ Written in TypeScript
- ✨ Deno support (+ Node and browser)
- 🚀 Super Fast
- 🔧 Configurable
  - Plugins, custom delimiters, caching
- 🔨 Powerful
  - Precompilation, partials, async
  - **Layout support**!
- 🔥 Reliable
  - Better quotes/comments support
    - _ex._ `<%= someval + "string %>" %>` compiles correctly, while it fails with doT or EJS
  - Great error reporting
- ⚡️ Exports ES Modules as well as UMD
- 📝 Easy template syntax

## Get Started

_For more thorough documentation, visit [https://eta.js.org](https://eta.js.org)_

Install Eta

```bash
npm install eta
```

In the root of your project, create `templates/simple.eta`

```eta
Hi <%= it.name %>!
```

Then, in your JS file:

```js
import { Eta } from "eta";
// import { Eta } from "https://deno.land/x/eta@v3.1.0/src/index.ts";

const eta = new Eta({ views: path.join(__dirname, "templates") });

// Render a template

const res = eta.render("./simple", { name: "Ben" });
console.log(res); // Hi Ben!
```

## FAQs

<details>
  <summary>
    <b>Where did Eta's name come from?</b>
  </summary>

"Eta" means tiny in Esperanto. Plus, it can be used as an acronym for all sorts of cool phrases: "ECMAScript Template Awesomeness", "Embedded Templating Alternative", etc....

Additionally, Eta is a letter of the Greek alphabet (it stands for all sorts of cool things in various mathematical fields, including efficiency) and is three letters long (perfect for a file extension).

</details>

<br />

## Integrations

<details>
  <summary>
    <b>Visual Studio Code</b>
  </summary>

[@shadowtime2000](https://github.com/shadowtime2000) created [eta-vscode](https://marketplace.visualstudio.com/items?itemName=shadowtime2000.eta-vscode).

</details>

<details>
  <summary>
    <b>ESLint</b>
  </summary>

[eslint-plugin-eta](https://github.com/eta-dev/eslint-plugin-eta) was created to provide an ESLint processor so you can lint your Eta templates.

</details>

<details>
  <summary>
    <b>Webpack</b>
  </summary>

Currently there is no official Webpack integration but [@clshortfuse](https://github.com/clshortfuse) shared the loader he uses:

```javascript
{
  loader: 'html-loader',
  options: {
    preprocessor(content, loaderContext) {
      return eta.render(content, {}, { filename: loaderContext.resourcePath });
    },
  },
}
```

</details>
  
<details>
  <summary>
    <b>Node-RED</b>
  </summary>

To operate with Eta templates in Node-RED: [@ralphwetzel/node-red-contrib-eta](https://flows.nodered.org/node/@ralphwetzel/node-red-contrib-eta)

  <img width="150" alt="image" src="https://user-images.githubusercontent.com/16342003/160198427-2a69ff10-e8bf-4873-9d99-2929a584ccc8.png">

</details>

<br />

## Projects using `eta`

- [Docusaurus v2](https://v2.docusaurus.io): open-source documentation framework that uses Eta to generate a SSR build
- [swagger-typescript-api](https://github.com/acacode/swagger-typescript-api): Open source typescript api codegenerator from Swagger. Uses Eta as codegenerator by templates
- [html-bundler-webpack-plugin](https://github.com/webdiscus/html-bundler-webpack-plugin): Webpack plugin make easily to bundle HTML pages from templates, source styles and scripts
- [SmartDeno](https://github.com/guildenstern70/SmartDeno): SmartDeno is an easy to setup web template using Deno & Oak
- [Add yours!](https://github.com/eta-dev/eta/edit/master/README.md)

## Contributors

Made with ❤ by [@nebrelbug](https://github.com/eta-dev) and all these wonderful contributors ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.bengubler.com"><img src="https://avatars3.githubusercontent.com/u/25597854?v=4?s=100" width="100px;" alt="Ben Gubler"/><br /><sub><b>Ben Gubler</b></sub></a><br /><a href="https://github.com/eta-dev/eta/commits?author=nebrelbug" title="Code">💻</a> <a href="#question-nebrelbug" title="Answering Questions">💬</a> <a href="https://github.com/eta-dev/eta/commits?author=nebrelbug" title="Documentation">📖</a> <a href="https://github.com/eta-dev/eta/commits?author=nebrelbug" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/clitetailor"><img src="https://avatars1.githubusercontent.com/u/16368559?v=4?s=100" width="100px;" alt="Clite Tailor"/><br /><sub><b>Clite Tailor</b></sub></a><br /><a href="#ideas-clitetailor" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/eta-dev/eta/commits?author=clitetailor" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://twitter.com/ioan_chiriac"><img src="https://avatars2.githubusercontent.com/u/173203?v=4?s=100" width="100px;" alt="Ioan CHIRIAC"/><br /><sub><b>Ioan CHIRIAC</b></sub></a><br /><a href="https://github.com/eta-dev/eta/commits?author=ichiriac" title="Code">💻</a> <a href="#ideas-ichiriac" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/craig-morten/"><img src="https://avatars1.githubusercontent.com/u/46491566?v=4?s=100" width="100px;" alt="Craig Morten"/><br /><sub><b>Craig Morten</b></sub></a><br /><a href="https://github.com/eta-dev/eta/commits?author=asos-craigmorten" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/trojanh"><img src="https://avatars0.githubusercontent.com/u/22974490?v=4?s=100" width="100px;" alt="Rajan Tiwari"/><br /><sub><b>Rajan Tiwari</b></sub></a><br /><a href="#example-trojanh" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://shadowtime2000.github.io"><img src="https://avatars1.githubusercontent.com/u/66655515?v=4?s=100" width="100px;" alt="shadowtime2000"/><br /><sub><b>shadowtime2000</b></sub></a><br /><a href="https://github.com/eta-dev/eta/commits?author=shadowtime2000" title="Code">💻</a> <a href="#ideas-shadowtime2000" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/eta-dev/eta/commits?author=shadowtime2000" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://hamidihamza.com"><img src="https://avatars0.githubusercontent.com/u/22576950?v=4?s=100" width="100px;" alt="Hamza Hamidi"/><br /><sub><b>Hamza Hamidi</b></sub></a><br /><a href="https://github.com/eta-dev/eta/commits?author=hamzahamidi" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://calumk.com"><img src="https://avatars1.githubusercontent.com/u/1183991?v=4?s=100" width="100px;" alt="Calum Knott"/><br /><sub><b>Calum Knott</b></sub></a><br /><a href="#ideas-calumk" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/nhaef"><img src="https://avatars.githubusercontent.com/u/16443053?v=4?s=100" width="100px;" alt="nhaef"/><br /><sub><b>nhaef</b></sub></a><br /><a href="https://github.com/eta-dev/eta/commits?author=nhaef" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://heyhey.to/Gün"><img src="https://avatars.githubusercontent.com/u/74139498?v=4?s=100" width="100px;" alt="Gün"/><br /><sub><b>Gün</b></sub></a><br /><a href="https://github.com/eta-dev/eta/commits?author=gurgunday" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!

## Credits

- Async support, file handling, and error formatting were based on code from [EJS](https://github.com/mde/ejs), which is licensed under the Apache-2.0 license. Code was modified and refactored to some extent.
- Syntax and some parts of compilation are heavily based off EJS, Nunjucks, and doT.
