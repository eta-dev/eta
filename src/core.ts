import { defaultConfig } from "./config.js";
import { Cacher } from "./storage.js";
import { parse } from "./parse.js";
import { compile } from "./compile.js";
import { compileToString } from "./compile-string.js";
import { render, renderAsync, renderString, renderStringAsync } from "./render.js";
import { TemplateFunction } from "./compile.js";

/* TYPES */
import type { EtaConfig, Options } from "./config.js";
/* END TYPES */

export class Eta {
  constructor(customConfig?: Partial<EtaConfig>) {
    if (customConfig) {
      this.config = { ...defaultConfig, ...customConfig };
    } else {
      this.config = { ...defaultConfig };
    }
  }

  config: EtaConfig;

  parse = parse;
  compile = compile;
  compileToString = compileToString;
  render = render;
  renderAsync = renderAsync;
  renderString = renderString;
  renderStringAsync = renderStringAsync;

  filepathCache: Record<string, string> = {};
  templatesSync = new Cacher<TemplateFunction>({});
  templatesAsync = new Cacher<TemplateFunction>({});

  // resolvePath takes a relative path from the "views" directory
  resolvePath: null | ((this: Eta, template: string, options?: Partial<Options>) => string) = null;
  readFile: null | ((this: Eta, path: string) => string) = null;

  // METHODS

  configure(customConfig: Partial<EtaConfig>) {
    this.config = { ...this.config, ...customConfig };
  }

  withConfig(customConfig: Partial<EtaConfig>) {
    return { ...this, config: { ...this.config, ...customConfig } };
  }

  loadTemplate(
    name: string,
    template: string | TemplateFunction, // template string or template function
    options?: { async: boolean }
  ): void {
    let templates = options && options.async ? this.templatesAsync : this.templatesSync;

    if (typeof template === "string") {
      templates.define(name, this.compile(template, options));
    } else {
      if (template.constructor.name === "AsyncFunction") {
        templates = this.templatesAsync;
      }

      templates.define(name, template);
    }
  }
}
