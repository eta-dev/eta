import { fs, path, readFileSync } from "./file-methods.ts";
var _BOM = /^\uFEFF/;

// express is set like: app.engine('html', require('eta').renderFile)

import EtaErr from "./err.ts";

/* TYPES */

import { EtaConfig } from "./config.ts";

/* END TYPES */

/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * If `name` does not have an extension, it will default to `.eta`
 *
 * @param name specified path
 * @param parentfile parent file path
 * @param isDirectory whether parentfile is a directory
 * @return absolute path to template
 */

function getWholeFilePath(
  name: string,
  parentfile: string,
  isDirectory?: boolean,
): string {
  var includePath = path.resolve(
    isDirectory ? parentfile : path.dirname(parentfile), // returns directory the parent file is in
    name, // file
  );
  var ext = path.extname(name);
  if (!ext) {
    includePath += ".eta";
  }
  return includePath;
}

/**
 * Get the absolute path to an included template
 *
 * If this is called with an absolute path (for example, starting with '/' or 'C:\') then Eta will return the filepath.
 *
 * If this is called with a relative path, Eta will:
 * - Look relative to the current template (if the current template has the `filename` property)
 * - Look inside each directory in options.views
 *
 * @param path    specified path
 * @param options compilation options
 * @return absolute path to template
 */

function getPath(path: string, options: EtaConfig) {
  var includePath;
  var filePath;
  var views = options.views;
  var match = /^[A-Za-z]+:\\|^\//.exec(path);

  // Abs path
  if (match && match.length) {
    includePath = getWholeFilePath(
      path.replace(/^\/*/, ""),
      options.root || "/",
      true,
    );
  } else {
    // Relative paths
    // Look relative to a passed filename first
    if (options.filename) {
      filePath = getWholeFilePath(path, options.filename);
      if (fs.existsSync(filePath)) {
        includePath = filePath;
      }
    }
    // Then look in any views directories
    // TODO: write tests for if views is a string
    if (!includePath) {
      // Loop through each views directory and search for the file.
      if (
        Array.isArray(views) &&
        views.some(function (v) {
          filePath = getWholeFilePath(path, v, true);
          return fs.existsSync(filePath);
        })
      ) {
        includePath = filePath;
      } else if (typeof views === "string") {
        // Search for the file if views is a single directory
        filePath = getWholeFilePath(path, views, true);
        if (fs.existsSync(filePath)) {
          includePath = filePath;
        }
      }
    }
    if (!includePath) {
      throw EtaErr('Could not find the include file "' + path + '"');
    }
  }
  return includePath;
}

/**
 * Reads a file synchronously
 */

function readFile(filePath: string) {
  return readFileSync(filePath).toString().replace(_BOM, ""); // TODO: is replacing BOM's necessary?
}

export { getPath, readFile };
