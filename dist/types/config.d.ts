interface Dict {
    [key: string]: SqrlConfig;
}
export interface SqrlConfig {
    varName: string;
    autoTrim: boolean | 'nl';
    autoEscape: boolean;
    defaultFilter: false | Function;
    tags: [string, string];
    loadFunction: Function;
    plugins: {
        processAST: Array<object>;
        processFuncString: Array<object>;
    };
    [index: string]: any;
}
export declare type PartialConfig = {
    [P in keyof SqrlConfig]?: SqrlConfig[P];
};
declare function Config(newConfig: PartialConfig, name?: string): SqrlConfig;
declare function getConfig(conf: string | PartialConfig): SqrlConfig;
declare var Env: Dict;
export { Env, Config, getConfig };
