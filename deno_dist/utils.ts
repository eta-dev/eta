// TODO: allow '-' to trim up until newline. Use [^\S\n\r] instead of \s
// TODO: only include trimLeft polyfill if not in ES6

import { trimLeft, trimRight } from "./polyfills.ts";

/* TYPES */

import type { EtaConfig } from "./config.ts";

interface EscapeMap {
  "&": "&amp;";
  "<": "&lt;";
  ">": "&gt;";
  '"': "&quot;";
  "'": "&#39;";
  [index: string]: string;
}

/* END TYPES */

export function hasOwnProp(obj: object, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function copyProps<T>(toObj: T, fromObj: T): T {
  for (const key in fromObj) {
    if (hasOwnProp(fromObj as unknown as object, key)) {
      toObj[key] = fromObj[key];
    }
  }
  return toObj;
}

/**
 * Takes a string within a template and trims it, based on the preceding tag's whitespace control and `config.autoTrim`
 */

function trimWS(
  str: string,
  config: EtaConfig,
  wsLeft: string | false,
  wsRight?: string | false,
): string {
  let leftTrim;
  let rightTrim;

  if (Array.isArray(config.autoTrim)) {
    // kinda confusing
    // but _}} will trim the left side of the following string
    leftTrim = config.autoTrim[1];
    rightTrim = config.autoTrim[0];
  } else {
    leftTrim = rightTrim = config.autoTrim;
  }

  if (wsLeft || wsLeft === false) {
    leftTrim = wsLeft;
  }

  if (wsRight || wsRight === false) {
    rightTrim = wsRight;
  }

  if (!rightTrim && !leftTrim) {
    return str;
  }

  if (leftTrim === "slurp" && rightTrim === "slurp") {
    return str.trim();
  }

  if (leftTrim === "_" || leftTrim === "slurp") {
    // console.log('trimming left' + leftTrim)
    // full slurp

    str = trimLeft(str);
  } else if (leftTrim === "-" || leftTrim === "nl") {
    // nl trim
    str = str.replace(/^(?:\r\n|\n|\r)/, "");
  }

  if (rightTrim === "_" || rightTrim === "slurp") {
    // full slurp
    str = trimRight(str);
  } else if (rightTrim === "-" || rightTrim === "nl") {
    // nl trim
    str = str.replace(/(?:\r\n|\n|\r)$/, ""); // TODO: make sure this gets \r\n
  }

  return str;
}

/**
 * A map of special HTML characters to their XML-escaped equivalents
 */

const escMap: EscapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function replaceChar(s: string): string {
  return escMap[s];
}

/**
 * XML-escapes an input value after converting it to a string
 *
 * @param str - Input value (usually a string)
 * @returns XML-escaped string
 */

function XMLEscape(str: any): string {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
  const newStr = String(str);
  if (/[&<>"']/.test(newStr)) {
    return newStr.replace(/[&<>"']/g, replaceChar);
  } else {
    return newStr;
  }
}

export { trimWS, XMLEscape };
