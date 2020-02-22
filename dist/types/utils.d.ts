import { SqrlConfig } from './config';
export declare var promiseImpl: any;
export declare function hasOwnProp(obj: object, prop: string): boolean;
export declare function copyProps<T>(toObj: T, fromObj: T): void;
declare function trimWS(str: string, env: SqrlConfig, wsLeft: string, wsRight?: string): string;
export { trimWS };
