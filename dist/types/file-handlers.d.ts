import { EtaConfig } from './config';
import { TemplateFunction } from './compile';
export declare type CallbackFn = (err: Error | null, str?: string) => void;
interface DataObj {
    settings?: {
        [key: string]: any;
    };
    [key: string]: any;
}
/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned
 * @static
 */
declare function includeFile(path: string, options: EtaConfig): TemplateFunction;
declare function renderFile(filename: string, data: DataObj, cb?: CallbackFn): any;
export { includeFile, renderFile };
