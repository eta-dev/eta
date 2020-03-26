import { EtaConfig } from './config';
interface GenericData {
    [index: string]: any;
}
export declare function includeFileHelper(this: EtaConfig, path: string, data: GenericData): string;
export {};
