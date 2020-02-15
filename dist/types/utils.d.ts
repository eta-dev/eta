import { SqrlConfig } from './config';
interface SomeObj {
    [key: string]: any;
}
export declare var promiseImpl: any;
declare function trimWS(str: string, env: SqrlConfig, wsLeft: string, wsRight?: string): string;
/**
 * Naive copy of properties from one object to another.
 * Does not recurse into non-scalar properties
 * Does not check to see if the property has a value before copying
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @return {Object}      Destination object
 * @static
 * @private
 */
declare function shallowCopy<res>(to: SomeObj, from: Partial<res>): res;
export { trimWS, shallowCopy };
