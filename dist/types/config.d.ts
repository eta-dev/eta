interface SqrlConfiguration {
    varName: string;
    autoTrim: boolean | 'nl';
    autoEscape: boolean;
    [index: string]: any;
}
declare var Conf: SqrlConfiguration;
declare function Config(key: string, val: any): void;
export { Conf, Config };
