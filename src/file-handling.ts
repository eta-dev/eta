import { EtaFileResolutionError } from "./err.ts";

import * as path from "node:path";

import * as fs from "node:fs";

/* TYPES */
import type { Eta as EtaCore } from "./core.ts";
import type { Options } from "./config.ts";
/* END TYPES */

export function readFile(this: EtaCore, path: string): string {
  let res = "";
  if(path.startsWith('@') && this.config.namespaces){
    path = resolveNamespace.call(this,path) ?? path;
  }

  try {
    res = fs.readFileSync(path, "utf8");
    // eslint-disable-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      throw new EtaFileResolutionError(`Could not find template: ${path}`);
    } else {
      throw err;
    }
  }

  return res;
}

/**
 *  Funtion resolves namespace path provided on namespaces in config
 */
function resolveNamespace(this: EtaCore,templatePath : string)  : string | null{
  const defaultExtension = this.config.defaultExtension === undefined
    ? ".eta"
    : this.config.defaultExtension;
  if(this.config.namespaces){
    const entries = Object.keys(this.config.namespaces);
    const namespace = entries.find(namespaceKey => {
      return templatePath.startsWith(namespaceKey);
    });
    if(namespace){
      templatePath = templatePath.replace(namespace,this.config.namespaces[namespace]);
      templatePath += path.extname(templatePath) ? "" : defaultExtension;
       return templatePath;
    }
  }
  return null;
}





export function resolvePath(
  this: EtaCore,
  templatePath: string,
  options?: Partial<Options>,
): string {
  let resolvedFilePath = "";
  const defaultExtension = this.config.defaultExtension === undefined
    ? ".eta"
    : this.config.defaultExtension;
    const baseFilePath = options && options.filepath;


    // Check if tempalte path has a namespace constant at the begining
  if(templatePath.startsWith('@') && this.config.namespaces){
    resolvedFilePath =  resolveNamespace.call(this,templatePath) ?? "";
    return resolvedFilePath;
  }
  

  const views = this.config.views;
  

  if (!views) {
    throw new EtaFileResolutionError("Views directory is not defined");
  }



  // how we index cached template paths
  const cacheIndex = JSON.stringify({
    filename: baseFilePath, // filename of the template which called includeFile()
    path: templatePath,
    views: this.config.views,
  });

  templatePath += path.extname(templatePath) ? "" : defaultExtension;

  // if the file was included from another template
  if (baseFilePath) {
    // check the cache

    if (this.config.cacheFilepaths && this.filepathCache[cacheIndex]) {
      return this.filepathCache[cacheIndex];
    }

    const absolutePathTest = absolutePathRegExp.exec(templatePath);

    if (absolutePathTest && absolutePathTest.length) {
      const formattedPath = templatePath.replace(/^\/*|^\\*/, "");
      resolvedFilePath = path.join(views, formattedPath);
    } else {
      resolvedFilePath = path.join(path.dirname(baseFilePath), templatePath);
    }
  } else {
    resolvedFilePath = path.join(views, templatePath);
  }

  if (dirIsChild(views, resolvedFilePath)) {
    // add resolved path to the cache
    if (baseFilePath && this.config.cacheFilepaths) {
      this.filepathCache[cacheIndex] = resolvedFilePath;
    }

    return resolvedFilePath;
  } else {
    throw new EtaFileResolutionError(
      `Template '${templatePath}' is not in the views directory`,
    );
  }
}

function dirIsChild(parent: string, dir: string) {
  const relative = path.relative(parent, dir);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

const absolutePathRegExp = /^\\|^\//;
