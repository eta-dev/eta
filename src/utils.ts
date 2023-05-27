import type { EtaConfig } from "./config";

/**
 * Takes a string within a template and trims it, based on the preceding tag's whitespace control and `config.autoTrim`
 */

export function trimWS(
  str: string,
  config: EtaConfig,
  wsLeft: string | false,
  wsRight?: string | false
): string {
  let leftTrim;
  let rightTrim;

  if (Array.isArray(config.autoTrim)) {
    // Slightly confusing,
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
    // full slurp
    str = str.trimStart();
  } else if (leftTrim === "-" || leftTrim === "nl") {
    // nl trim
    str = str.replace(/^(?:\r\n|\n|\r)/, "");
  }

  if (rightTrim === "_" || rightTrim === "slurp") {
    // full slurp
    str = str.trimEnd();
  } else if (rightTrim === "-" || rightTrim === "nl") {
    // nl trim
    str = str.replace(/(?:\r\n|\n|\r)$/, "");
  }

  return str;
}

/**
 * A map of special HTML characters to their XML-escaped equivalents
 */

const escMap: { [key: string]: string } = {
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

export function XMLEscape(str: unknown): string {
  // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
  const newStr = String(str);
  if (/[&<>"']/.test(newStr)) {
    return newStr.replace(/[&<>"']/g, replaceChar);
  } else {
    return newStr;
  }
}
