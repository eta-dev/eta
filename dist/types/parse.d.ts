export declare enum TagType {
    Helper = "~",
    HelperEnd = "/",
    Block = "#",
    Custom = "?",
    Ref = "r",
    Exec = "!",
    SelfClosing = "s"
}
export declare enum templateAttribute {
    Content = "c",
    Filter = "f",
    FilterParams = "fp",
    Params = "p",
    Name = "n",
    Err = "err",
    Results = "res"
}
export declare type AstObject = string | TemplateObject;
export declare type Filter = [string, string | undefined];
export interface TemplateObject {
    n?: string;
    t?: string;
    f: Array<Filter>;
    c?: Array<AstObject>;
    p?: string;
    d?: Array<AstObject>;
    b?: Array<TemplateObject>;
    [index: string]: any;
}
export default function Parse(str: string, tagOpen: string, tagClose: string): Array<AstObject>;
