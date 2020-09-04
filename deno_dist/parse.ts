import { ParseErr } from "./err.ts";
import { trimWS } from "./utils.ts";

/* TYPES */

import { EtaConfig } from "./config.ts";

export type TagType = "r" | "e" | "i" | "";

export interface TemplateObject {
  t: TagType;
  val: string;
}

export type AstObject = string | TemplateObject;

/* END TYPES */

var templateLitReg =
  /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g;

var singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g;

var doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;

/** Escape special regular expression characters inside a string */

function escapeRegExp(string: string) {
  // From MDN
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export default function parse(str: string, env: EtaConfig): Array<AstObject> {
  var buffer: Array<AstObject> = [];
  var trimLeftOfNextStr: string | false = false;
  var lastIndex = 0;
  var parseOptions = env.parse;

  /* Adding for EJS compatibility */
  if (env.rmWhitespace) {
    // Code taken directly from EJS
    // Have to use two separate replaces here as `^` and `$` operators don't
    // work well with `\r` and empty lines don't work well with the `m` flag.
    // Essentially, this replaces the whitespace at the beginning and end of
    // each line and removes multiple newlines.
    str = str.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "");
  }
  /* End rmWhitespace option */

  templateLitReg.lastIndex = 0;
  singleQuoteReg.lastIndex = 0;
  doubleQuoteReg.lastIndex = 0;

  function pushString(strng: string, shouldTrimRightOfString?: string | false) {
    if (strng) {
      // if string is truthy it must be of type 'string'

      strng = trimWS(
        strng,
        env,
        trimLeftOfNextStr, // this will only be false on the first str, the next ones will be null or undefined
        shouldTrimRightOfString,
      );

      if (strng) {
        // replace \ with \\, ' with \'
        // we're going to convert all CRLF to LF so it doesn't take more than one replace

        strng = strng.replace(/\\|'/g, "\\$&").replace(/\r\n|\n|\r/g, "\\n");

        buffer.push(strng);
      }
    }
  }

  var prefixes = [parseOptions.exec, parseOptions.interpolate, parseOptions.raw]
    .reduce(function (
      accumulator,
      prefix,
    ) {
      if (accumulator && prefix) {
        return accumulator + "|" + escapeRegExp(prefix);
      } else if (prefix) {
        // accumulator is falsy
        return escapeRegExp(prefix);
      } else {
        // prefix and accumulator are both falsy
        return accumulator;
      }
    }, "");

  var parseOpenReg = new RegExp(
    "([^]*?)" + escapeRegExp(env.tags[0]) + "(-|_)?\\s*(" + prefixes + ")?\\s*",
    "g",
  );

  var parseCloseReg = new RegExp(
    "'|\"|`|\\/\\*|(\\s*(-|_)?" + escapeRegExp(env.tags[1]) + ")",
    "g",
  );
  // TODO: benchmark having the \s* on either side vs using str.trim()

  var m;

  while ((m = parseOpenReg.exec(str))) {
    lastIndex = m[0].length + m.index;

    var precedingString = m[1];
    var wsLeft = m[2];
    var prefix = m[3] || ""; // by default either ~, =, or empty

    pushString(precedingString, wsLeft);

    parseCloseReg.lastIndex = lastIndex;
    var closeTag;
    var currentObj: AstObject | false = false;

    while ((closeTag = parseCloseReg.exec(str))) {
      if (closeTag[1]) {
        var content = str.slice(lastIndex, closeTag.index);

        parseOpenReg.lastIndex = lastIndex = parseCloseReg.lastIndex;

        trimLeftOfNextStr = closeTag[2];

        var currentType: TagType = "";
        if (prefix === parseOptions.exec) {
          currentType = "e";
        } else if (prefix === parseOptions.raw) {
          currentType = "r";
        } else if (prefix === parseOptions.interpolate) {
          currentType = "i";
        }

        currentObj = { t: currentType, val: content };
        break;
      } else {
        var char = closeTag[0];
        if (char === "/*") {
          var commentCloseInd = str.indexOf("*/", parseCloseReg.lastIndex);

          if (commentCloseInd === -1) {
            ParseErr("unclosed comment", str, closeTag.index);
          }
          parseCloseReg.lastIndex = commentCloseInd;
        } else if (char === "'") {
          singleQuoteReg.lastIndex = closeTag.index;

          var singleQuoteMatch = singleQuoteReg.exec(str);
          if (singleQuoteMatch) {
            parseCloseReg.lastIndex = singleQuoteReg.lastIndex;
          } else {
            ParseErr("unclosed string", str, closeTag.index);
          }
        } else if (char === '"') {
          doubleQuoteReg.lastIndex = closeTag.index;
          var doubleQuoteMatch = doubleQuoteReg.exec(str);

          if (doubleQuoteMatch) {
            parseCloseReg.lastIndex = doubleQuoteReg.lastIndex;
          } else {
            ParseErr("unclosed string", str, closeTag.index);
          }
        } else if (char === "`") {
          templateLitReg.lastIndex = closeTag.index;
          var templateLitMatch = templateLitReg.exec(str);
          if (templateLitMatch) {
            parseCloseReg.lastIndex = templateLitReg.lastIndex;
          } else {
            ParseErr("unclosed string", str, closeTag.index);
          }
        }
      }
    }
    if (currentObj) {
      buffer.push(currentObj);
    } else {
      ParseErr("unclosed tag", str, m.index + precedingString.length);
    }
  }

  pushString(str.slice(lastIndex, str.length), false);

  if (env.plugins) {
    for (var i = 0; i < env.plugins.length; i++) {
      var plugin = env.plugins[i];
      if (plugin.processAST) {
        buffer = plugin.processAST(buffer, env);
      }
    }
  }

  return buffer;
}
