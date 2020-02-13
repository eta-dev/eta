import { TemplateFunction } from './compile';
import { SqrlConfig, PartialConfig } from './config';
declare type CallbackFn = (err: Error | null, str?: string) => void;
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
declare function includeFile(path: string, options: SqrlConfig): TemplateFunction;
interface DataObj {
    settings?: {
        [key: string]: any;
    };
    [key: string]: any;
}
declare function renderFile(filename: string, data: DataObj, options: PartialConfig, cb?: CallbackFn): any;
export { includeFile, renderFile };
