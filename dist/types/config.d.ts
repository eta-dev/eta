import { TemplateFunction } from './compile';
import { Cacher } from './storage';
declare type trimConfig = 'nl' | 'slurp' | false;
export interface EtaConfig {
    /** Name of the data object. Default `it` */
    varName: string;
    /** Configure automatic whitespace trimming. Default `[false, 'nl']` */
    autoTrim: trimConfig | [trimConfig, trimConfig];
    /** Remove all safe-to-remove whitespace */
    rmWhitespace: boolean;
    /** Whether or not to automatically XML-escape interpolations. Default true */
    autoEscape: boolean;
    /** Delimiters: by default `['<%', '%>']` */
    tags: [string, string];
    /** Parsing options */
    parse: {
        /** Which prefix to use for interpolation. Default `"="` */
        interpolate: string;
        /** Which prefix to use for raw interpolation. Default `"~"` */
        raw: string;
        /** Which prefix to use for evaluation. Default `""` */
        exec: string;
    };
    /** XML-escaping function */
    e: (str: string) => string;
    plugins: Array<{
        processFnString?: Function;
        processAST?: Function;
    }>;
    /** Compile to async function */
    async: boolean;
    /** Holds template cache */
    templates: Cacher<TemplateFunction>;
    /** Whether or not to cache templates if `name` or `filename` is passed */
    cache: boolean;
    /** Directories that contain templates */
    views?: string | Array<string>;
    /** Where should absolute paths begin? Default '/' */
    root?: string;
    /** Absolute path to template file */
    filename?: string;
    /** Name of template file */
    name?: string;
    /** Whether or not to cache templates if `name` or `filename` is passed */
    'view cache'?: boolean;
    /** Make data available on the global object instead of varName */
    useWith?: boolean;
    [index: string]: any;
}
export interface EtaConfigWithFilename extends EtaConfig {
    filename: string;
}
export declare type PartialConfig = Partial<EtaConfig>;
/** Eta's base (global) configuration */
declare var config: EtaConfig;
/**
 * Takes one or two partial (not necessarily complete) configuration objects, merges them 1 layer deep into eta.config, and returns the result
 *
 * @param override Partial configuration object
 * @param baseConfig Partial configuration object to merge before `override`
 *
 * **Example**
 *
 * ```js
 * let customConfig = getConfig({tags: ['!#', '#!']})
 * ```
 */
declare function getConfig(override: PartialConfig, baseConfig?: EtaConfig): EtaConfig;
/** Update Eta's base config */
declare function configure(options: PartialConfig): Partial<EtaConfig>;
export { config, getConfig, configure };
