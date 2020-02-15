import { SqrlConfig } from './config';
import { AstObject } from './parse';
declare function compileToString(str: string, env: SqrlConfig): string;
export declare function compileScopeIntoFunction(buff: Array<AstObject>, res: string, env: SqrlConfig): string;
export declare function compileScope(buff: Array<AstObject>, env: SqrlConfig): string;
export default compileToString;
