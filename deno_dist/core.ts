import { defaultConfig } from "./config.ts";
import { Cacher } from "./storage.ts";
import { parse } from "./parse.ts";
import { compile } from "./compile.ts";
import { compileToString } from "./compile-string.ts";
import {
  render,
  renderAsync,
  renderString,
  renderStringAsync,
} from "./render.ts";
import { TemplateFunction } from "./compile.ts";
import { XMLEscape } from "./utils.ts";

/* TYPES */
import type { EtaConfig, Options } from "./config.ts";
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

  templatesSync = new Cacher<TemplateFunction>({});
  templatesAsync = new Cacher<TemplateFunction>({});

  escapeFunction = XMLEscape;
  filterFunction = null;

  // resolvePath takes a relative path from the "views" directory
  resolvePath:
    | null
    | ((this: Eta, template: string, options?: Partial<Options>) => string) =
      null;
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
    options?: { async: boolean },
  ): void {
    let templates = options && options.async
      ? this.templatesAsync
      : this.templatesSync;

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
