declare function EtaErr(message: string): Error;
declare namespace EtaErr {
    var prototype: any;
}
export default EtaErr;
export declare function ParseErr(message: string, str: string, indx: number): void;
