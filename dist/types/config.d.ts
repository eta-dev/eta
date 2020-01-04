interface Dict {
    [key: string]: SqrlConfig;
}
interface IEnv {
    cache: Dict;
    define: (key: string, val: SqrlConfig) => void;
    get: (key: string) => SqrlConfig;
    remove: (key: string) => void;
    clear: () => void;
    load: (cacheObj: Dict) => void;
}
export interface SqrlConfig {
    varName: string;
    autoTrim: boolean | 'nl';
    autoEscape: boolean;
    defaultFilter: false | Function;
    [index: string]: any;
}
declare var Env: IEnv;
export { Env };
