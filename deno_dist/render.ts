import { EtaError } from "./err.ts";

/* TYPES */
import type { Options } from "./config.ts";
import type { TemplateFunction } from "./compile.ts";
import type { Eta } from "./core.ts";
/* END TYPES */

function handleCache(
  this: Eta,
  template: string,
  options: Partial<Options>,
): TemplateFunction {
  let templateStore = options && options.async
    ? this.templatesAsync
    : this.templatesSync;

  if (this.resolvePath && this.readFile && !template.startsWith("@")) {
    let templatePath = options.filepath as string;

    let cachedTemplate = templateStore.get(templatePath);

    if (this.config.cache && cachedTemplate) {
      return cachedTemplate;
    } else {
      let templateString = this.readFile(templatePath);

      let templateFn = this.compile(templateString, options);

      if (this.config.cache) templateStore.define(templatePath, templateFn);

      return templateFn;
    }
  } else {
    let cachedTemplate = templateStore.get(template);

    if (cachedTemplate) {
      return cachedTemplate;
    } else {
      throw new EtaError("Failed to get template '" + template + "'");
    }
  }
}

export function render(
  this: Eta,
  template: string | TemplateFunction, // template name or template function
  data: object,
  meta?: { filepath: string },
): string {
  let Eta = this;

  let templateFn: TemplateFunction;
  let options = { ...meta, async: false };

  if (typeof template === "string") {
    if (this.resolvePath && this.readFile && !template.startsWith("@")) {
      options.filepath = this.resolvePath(template, options);
    }

    templateFn = handleCache.call(Eta, template, options);
  } else {
    templateFn = template;
  }

  let res = templateFn.call(Eta, data, options);

  return res;
}

export function renderAsync(
  this: Eta,
  template: string | TemplateFunction, // template name or template function
  data: object,
  meta?: { filepath: string },
): Promise<string> {
  let Eta = this;

  let templateFn: TemplateFunction;
  let options = { ...meta, async: true };

  if (typeof template === "string") {
    if (this.resolvePath && this.readFile && !template.startsWith("@")) {
      options.filepath = this.resolvePath(template, options);
    }

    templateFn = handleCache.call(Eta, template, options);
  } else {
    templateFn = template;
  }

  let res = templateFn.call(Eta, data, options);

  // Return a promise
  return new Promise(function (resolve: Function, reject: Function) {
    try {
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
}

export function renderString(
  this: Eta,
  template: string,
  data: object,
): string {
  let templateFn = this.compile(template, { async: false });

  return render.call(this, templateFn, data);
}

export function renderStringAsync(
  this: Eta,
  template: string,
  data: object,
): Promise<string> {
  let templateFn = this.compile(template, { async: true });

  return renderAsync.call(this, templateFn, data);
}
