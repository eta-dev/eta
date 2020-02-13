import { TemplateFunction } from './compile';
import { SqrlConfig, PartialConfig } from './config';
interface PartialFileOptions extends PartialConfig {
    filename: string;
}
/**
 * Get the path to the included file by Options
 *
 * @param  {String}  path    specified path
 * @param  {Options} options compilation options
 * @return {String}
 */
declare function getPath(path: string, options: SqrlConfig): any;
declare function readFile(filePath: string): any;
declare function loadFile(filePath: string, options: PartialFileOptions): TemplateFunction;
export { getPath, readFile, loadFile };
