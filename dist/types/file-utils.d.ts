import { EtaConfig, PartialConfig } from './config';
import { TemplateFunction } from './compile';
interface PartialFileConfig extends PartialConfig {
    filename: string;
}
/**
 * Get the path to the included file by Options
 *
 * @param  {String}  path    specified path
 * @param  {Options} options compilation options
 * @return {String}
 */
declare function getPath(path: string, options: EtaConfig): any;
declare function readFile(filePath: string): any;
declare function loadFile(filePath: string, options: PartialFileConfig): TemplateFunction;
export { getPath, readFile, loadFile };
