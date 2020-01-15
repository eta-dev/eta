import { SqrlConfig } from './config';
export declare type TagType = '~' | '/' | '#' | '?' | 'r' | '!' | 's';
export declare type TemplateAttribute = 'c' | 'f' | 'fp' | 'p' | 'n' | 'res' | 'err';
export declare type TemplateObjectAttribute = 'c' | 'p' | 'n' | 'res';
export declare type AstObject = string | TemplateObject;
export declare type Filter = [string, string | undefined];
export interface TemplateObject {
    n?: string;
    t?: string;
    f?: Array<Filter>;
    c?: string;
    p?: string;
    res?: string;
    d?: Array<AstObject>;
    raw?: boolean;
    b?: Array<TemplateObject>;
}
export interface ParentTemplateObject extends TemplateObject {
    d: Array<AstObject>;
}
interface FilteredTemplateObject extends TemplateObject {
    f: Array<Filter>;
}
interface FilteredParentTemplateObject extends ParentTemplateObject {
    f: Array<Filter>;
}
export declare type FilteredObject = FilteredTemplateObject | FilteredParentTemplateObject;
export default function Parse(str: string, tagOpen: string, tagClose: string, env: SqrlConfig): Array<AstObject>;
export {};
