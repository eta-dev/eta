import { AstObject } from './parse';
import { SqrlConfig } from './config';
declare function CompileToString(str: string, tagOpen: string, tagClose: string, env: SqrlConfig): string;
export declare function ParseScopeIntoFunction(buff: Array<AstObject>, res: string, env: SqrlConfig): string;
export declare function ParseScope(buff: Array<AstObject>, env: SqrlConfig): string;
export default CompileToString;
