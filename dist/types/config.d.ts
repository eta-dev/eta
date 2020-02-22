export declare type FetcherFunction = (container: 'H' | 'F', name: string) => any;
declare type trimConfig = 'nl' | 'slurp' | boolean;
export interface SqrlConfig {
    varName: string;
    autoTrim: trimConfig | [trimConfig, trimConfig];
    autoEscape: boolean;
    defaultFilter: false | Function;
    tags: [string, string];
    l: FetcherFunction;
    plugins: {
        processAST: Array<object>;
        processFnString: Array<object>;
    };
    async: boolean;
    asyncFilters?: Array<string>;
    asyncHelpers?: Array<string>;
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
    [P in keyof SqrlConfig]?: SqrlConfig[P];
};
declare var defaultConfig: SqrlConfig;
declare function getConfig(override: PartialConfig, baseConfig?: SqrlConfig): SqrlConfig;
export { defaultConfig, getConfig };
