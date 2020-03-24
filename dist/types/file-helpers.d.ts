import { EtaConfig } from './config';
interface GenericData {
    [index: string]: any;
}
export declare function includeFileHelper(path: string, data: GenericData, config: EtaConfig): string;
export {};
