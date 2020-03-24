import { EtaConfig } from './config';
export declare type TagType = 'r' | 'e' | 'i' | '';
export interface TemplateObject {
    t: TagType;
    val: string;
}
export declare type AstObject = string | TemplateObject;
export default function parse(str: string, env: EtaConfig): Array<AstObject>;
