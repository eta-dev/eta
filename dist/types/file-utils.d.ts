import { EtaConfig } from './config';
/**
 * Get the absolute path to an included template
 *
 * If this is called with an absolute path (for example, starting with '/' or 'C:\') then Eta will return the filepath.
 *
 * If this is called with a relative path, Eta will:
 * - Look relative to the current template (if the current template has the `filename` property)
 * - Look inside each directory in options.views
 *
 * @param path    specified path
 * @param options compilation options
 * @return absolute path to template
 */
declare function getPath(path: string, options: EtaConfig): string;
/**
 * Reads a file synchronously
 */
declare function readFile(filePath: string): any;
export { getPath, readFile };
