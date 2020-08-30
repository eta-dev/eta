import { EtaConfig } from './config';
export declare function hasOwnProp(obj: object, prop: string): boolean;
export declare function copyProps<T>(toObj: T, fromObj: T): T;
declare function trimWS(str: string, env: EtaConfig, wsLeft: string | false, wsRight?: string | false): string;
declare function XMLEscape(str: any): string;
export { trimWS, XMLEscape };
