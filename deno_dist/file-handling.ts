import { EtaError } from "./err.ts";

import * as path from "node:node:path";

import * as fs from "node:node:fs";

/* TYPES */
import type { Eta as EtaCore } from "./core.ts";
import type { Options } from "./config.ts";
/* END TYPES */

export function readFile(this: EtaCore, path: string): string {
  let res = "";

  try {
    res = fs.readFileSync(path, "utf8");
    // eslint-disable-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      throw new EtaError(`Could not find template: ${path}`);
    } else {
      throw err;
    }
  }

  return res;
}

export function resolvePath(
  this: EtaCore,
  template: string,
  options?: Partial<Options>,
): string {
  let resolvedFilePath = "";

  template += path.extname(template) ? "" : ".eta";

  const views = this.config.views;

  if (!views) {
    throw new EtaError("Views directory is not defined");
  }

  const baseFilePath = options && options.filepath;

  // if the file was included from another template
  if (baseFilePath) {
    // check the cache
    if (this.config.filepathCache && this.config.filepathCache[baseFilePath]) {
      return this.config.filepathCache[baseFilePath];
    }

    const absolutePathTest = absolutePathRegExp.exec(template);

    if (absolutePathTest && absolutePathTest.length) {
      const formattedPath = template.replace(/^\/*/, "");
      resolvedFilePath = path.join(views, formattedPath);
    } else {
      resolvedFilePath = path.join(path.dirname(baseFilePath), template);
    }
  } else {
    resolvedFilePath = path.join(views, template);
  }

  if (dirIsChild(views, resolvedFilePath)) {
    // add resolved path to the cache
    if (baseFilePath && this.config.filepathCache) {
      this.config.filepathCache[baseFilePath] = resolvedFilePath;
    }

    return resolvedFilePath;
  } else {
    throw new EtaError(`Template '${template}' is not in the views directory`);
  }
}

function dirIsChild(parent: string, dir: string) {
  const relative = path.relative(parent, dir);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

const absolutePathRegExp = /^\\|^\//;
