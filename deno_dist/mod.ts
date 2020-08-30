//@denoify-ignore

/* Export file stuff */
import { includeFileHelper } from "./file-helpers";
import { defaultConfig } from "./config";

/* TYPES */

/* END TYPES */

defaultConfig.includeFile = includeFileHelper;
includeFileHelper.bind(defaultConfig);

export { renderFile, renderFile as __express } from "./file-handlers";
export { loadFile } from "./file-utils";

/* End file stuff */

export { default as compileToString } from "./compile-string";
export { default as compile } from "./compile";
export { default as parse } from "./parse";
export { default as render } from "./render";
export { templates } from "./containers";
export { defaultConfig, getConfig } from "./config";
