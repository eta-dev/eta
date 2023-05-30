import { Cacher } from "./storage.js";
import { compile } from "./compile.js";
import { compileToString } from "./compile-string.js";
import { defaultConfig } from "./config.js";
import { parse } from "./parse.js";
import { render, renderAsync, renderString, renderStringAsync } from "./render.js";
import { RuntimeErr, EtaError } from "./err.js";
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

  RuntimeErr = RuntimeErr;

  compile = compile;
  compileToString = compileToString;
  parse = parse;
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
    if (typeof template === "string") {
      const templates = options && options.async ? this.templatesAsync : this.templatesSync;

      templates.define(name, this.compile(template, options));
    } else {
      let templates = this.templatesSync;

      if (template.constructor.name === "AsyncFunction" || (options && options.async)) {
        templates = this.templatesAsync;
      }

      templates.define(name, template);
    }
  }
}

// for instance checking against thrown errors
export { EtaError };
