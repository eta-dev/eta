export const promiseImpl = Promise;

export function getAsyncFunctionConstructor(): Function {
  return async function () {}.constructor;
}

export function trimLeft(str: string): string {
  return str.trimLeft();
}

export function trimRight(str: string): string {
  return str.trimRight();
}
