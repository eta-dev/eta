import { AstObject } from './parse';
declare function CompileToString(str: string, tagOpen: string, tagClose: string): string;
export declare function ParseScopeIntoFunction(buff: Array<AstObject>, res: string): string;
export declare function ParseScope(buff: Array<AstObject>): string;
export default CompileToString;
