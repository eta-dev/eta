// @denoify-ignore

import { Eta as EtaCore } from "./core.js";
import { readFile, resolvePath } from "./file-handling.js";

export class Eta extends EtaCore {
  readFile = readFile;

  resolvePath = resolvePath;
}
