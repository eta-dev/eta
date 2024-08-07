import { Eta as EtaCore } from "./core.ts";
import { readFile, resolvePath } from "./file-handling.ts";
export {
  EtaError,
  EtaFileResolutionError,
  EtaNameResolutionError,
  EtaParseError,
  EtaRuntimeError,
} from "./err.ts";
export { type EtaConfig, type Options } from "./config.ts";

export class Eta extends EtaCore {
  readFile = readFile;

  resolvePath = resolvePath;
}
