import { TemplateFunction } from './compile';
import { Cacher } from './storage';
declare type trimConfig = 'nl' | 'slurp' | false;
export interface EtaConfig {
    varName: string;
    autoTrim: trimConfig | [trimConfig, trimConfig];
    rmWhitespace: boolean;
    autoEscape: boolean;
    tags: [string, string];
    parse: {
        interpolate: string;
        raw: string;
        exec: string;
    };
    e: (str: string) => string;
    plugins: Array<{
        processFnString?: Function;
        processAST?: Function;
    }>;
    async: boolean;
    templates: Cacher<TemplateFunction>;
    cache: boolean;
    views?: string | Array<string>;
    root?: string;
    filename?: string;
    name?: string;
    'view cache'?: boolean;
    useWith?: boolean;
    [index: string]: any;
}
export declare type PartialConfig = {
    [P in keyof EtaConfig]?: EtaConfig[P];
};
declare var defaultConfig: EtaConfig;
declare function getConfig(override: PartialConfig, baseConfig?: EtaConfig): EtaConfig;
export { defaultConfig, getConfig };
