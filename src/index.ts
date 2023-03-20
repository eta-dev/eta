// @denoify-ignore

/* Export file stuff */
import { includeFileHelper } from "./file-helpers.js";
import { config } from "./config.js";

config.includeFile = includeFileHelper;
config.filepathCache = {};

export { loadFile, renderFile, renderFileAsync, renderFile as __express } from "./file-handlers.js";

/* End file stuff */

export { default as compileToString } from "./compile-string.js";
export { default as compile } from "./compile.js";
export { default as parse } from "./parse.js";
export { default as render, renderAsync } from "./render.js";
export { templates } from "./containers.js";
export { EtaConfig, config, config as defaultConfig, getConfig, configure } from "./config.js";
