export declare type TagType = '~' | '/' | '#' | '?' | 'r' | '!' | 's';
export declare type TemplateAttribute = 'c' | 'f' | 'fp' | 'p' | 'n' | 'res' | 'err';
export declare type TemplateObjectAttribute = 'c' | 'p' | 'n' | 'res';
export declare type AstObject = string | TemplateObject;
export declare type Filter = [string, string | undefined];
export interface TemplateObject {
    n?: string;
    t?: string;
    f: Array<Filter>;
    c?: string;
    p?: string;
    res?: string;
    d: Array<AstObject>;
    b?: Array<TemplateObject>;
}
export default function Parse(str: string, tagOpen: string, tagClose: string): Array<AstObject>;
