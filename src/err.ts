export class EtaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Eta Error";
  }
}

/**
 * Throws an EtaError with a nicely formatted error and message showing where in the template the error occurred.
 */

// TODO: make more advanced

export function ParseErr(message: string, str: string, indx: number): void {
  const whitespace = str.slice(0, indx).split(/\n/);

  const lineNo = whitespace.length;
  const colNo = whitespace[lineNo - 1].length + 1;
  message +=
    " at line " +
    lineNo +
    " col " +
    colNo +
    ":\n\n" +
    "  " +
    str.split(/\n/)[lineNo - 1] +
    "\n" +
    "  " +
    Array(colNo).join(" ") +
    "^";
  throw new EtaError(message);
}
