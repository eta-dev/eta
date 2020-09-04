import { EtaConfig, PartialConfig } from './config';
import { CallbackFn } from './file-handlers';
export declare type TemplateFunction = (data: object, config: EtaConfig, cb?: CallbackFn) => string;
/**
 * Takes a template string and returns a template function that can be called with (data, config, [cb])
 *
 * @param str - The template string
 * @param config - A custom configuration object (optional)
 *
 * **Example**
 *
 * ```js
 * let compiledFn = eta.compile("Hi <%= it.user %>")
 * // function anonymous()
 * let compiledFnStr = compiledFn.toString()
 * // "function anonymous(it,E,cb\n) {\nvar tR='';tR+='Hi ';tR+=E.e(it.user);if(cb){cb(null,tR)} return tR\n}"
 * ```
 */
export default function compile(str: string, config?: PartialConfig): TemplateFunction;
