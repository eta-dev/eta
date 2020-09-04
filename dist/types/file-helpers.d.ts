import { EtaConfig } from './config';
interface GenericData {
    [index: string]: any;
}
/**
 * Called with `E.includeFile(path, data)`
 */
export declare function includeFileHelper(this: EtaConfig, path: string, data: GenericData): string;
export {};
