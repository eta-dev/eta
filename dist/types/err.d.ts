declare function SqrlErr(message: string): Error;
declare namespace SqrlErr {
    var prototype: any;
}
export default SqrlErr;
export declare function ParseErr(message: string, str: string, indx: number): void;
