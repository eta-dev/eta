import { existsSync, path, readFileSync } from "./file-methods.ts";
const _BOM = /^\uFEFF/;

// express is set like: app.engine('html', require('eta').renderFile)

import EtaErr from "./err.ts";

/* TYPES */

import type { EtaConfig } from "./config.ts";

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
  const includePath = path.resolve(
    isDirectory ? parentfile : path.dirname(parentfile), // returns directory the parent file is in
    name, // file
  ) + (path.extname(name) ? "" : ".eta");
  return includePath;
}

/**
 * Get the absolute path to an included template
 *
 * If this is called with an absolute path (for example, starting with '/' or 'C:\')
 * then Eta will attempt to resolve the absolute path within options.views. If it cannot,
 * Eta will fallback to options.root or '/'
 *
 * If this is called with a relative path, Eta will:
 * - Look relative to the current template (if the current template has the `filename` property)
 * - Look inside each directory in options.views
 *
 * Note: if Eta is unable to find a template using path and options, it will throw an error.
 *
 * @param path    specified path
 * @param options compilation options
 * @return absolute path to template
 */

function getPath(path: string, options: EtaConfig): string {
  let includePath: string | false = false;
  const views = options.views;
  const searchedPaths: Array<string> = [];

  // If these four values are the same,
  // getPath() will return the same result every time.
  // We can cache the result to avoid expensive
  // file operations.
  const pathOptions = JSON.stringify({
    filename: options.filename, // filename of the template which called includeFile()
    path: path,
    root: options.root,
    views: options.views,
  });

  if (
    options.cache && options.filepathCache && options.filepathCache[pathOptions]
  ) {
    // Use the cached filepath
    return options.filepathCache[pathOptions];
  }

  /** Add a filepath to the list of paths we've checked for a template */
  function addPathToSearched(pathSearched: string) {
    if (!searchedPaths.includes(pathSearched)) {
      searchedPaths.push(pathSearched);
    }
  }

  /**
   * Take a filepath (like 'partials/mypartial.eta'). Attempt to find the template file inside `views`;
   * return the resulting template file path, or `false` to indicate that the template was not found.
   *
   * @param views the filepath that holds templates, or an array of filepaths that hold templates
   * @param path the path to the template
   */

  function searchViews(
    views: Array<string> | string | undefined,
    path: string,
  ): string | false {
    let filePath;

    // If views is an array, then loop through each directory
    // And attempt to find the template
    if (
      Array.isArray(views) &&
      views.some(function (v) {
        filePath = getWholeFilePath(path, v, true);

        addPathToSearched(filePath);

        return existsSync(filePath);
      })
    ) {
      // If the above returned true, we know that the filePath was just set to a path
      // That exists (Array.some() returns as soon as it finds a valid element)
      return filePath as unknown as string;
    } else if (typeof views === "string") {
      // Search for the file if views is a single directory
      filePath = getWholeFilePath(path, views, true);

      addPathToSearched(filePath);

      if (existsSync(filePath)) {
        return filePath;
      }
    }

    // Unable to find a file
    return false;
  }

  // Path starts with '/', 'C:\', etc.
  const match = /^[A-Za-z]+:\\|^\//.exec(path);

  // Absolute path, like /partials/partial.eta
  if (match && match.length) {
    // We have to trim the beginning '/' off the path, or else
    // path.resolve(dir, path) will always resolve to just path
    const formattedPath = path.replace(/^\/*/, "");

    // First, try to resolve the path within options.views
    includePath = searchViews(views, formattedPath);
    if (!includePath) {
      // If that fails, searchViews will return false. Try to find the path
      // inside options.root (by default '/', the base of the filesystem)
      const pathFromRoot = getWholeFilePath(
        formattedPath,
        options.root || "/",
        true,
      );

      addPathToSearched(pathFromRoot);

      includePath = pathFromRoot;
    }
  } else {
    // Relative paths
    // Look relative to a passed filename first
    if (options.filename) {
      const filePath = getWholeFilePath(path, options.filename);

      addPathToSearched(filePath);

      if (existsSync(filePath)) {
        includePath = filePath;
      }
    }
    // Then look for the template in options.views
    if (!includePath) {
      includePath = searchViews(views, path);
    }
    if (!includePath) {
      throw EtaErr(
        'Could not find the template "' + path + '". Paths tried: ' +
          searchedPaths,
      );
    }
  }

  // If caching and filepathCache are enabled,
  // cache the input & output of this function.
  if (options.cache && options.filepathCache) {
    options.filepathCache[pathOptions] = includePath;
  }

  return includePath;
}

/**
 * Reads a file synchronously
 */

function readFile(filePath: string): string {
  try {
    return readFileSync(filePath).toString().replace(_BOM, ""); // TODO: is replacing BOM's necessary?
  } catch {
    throw EtaErr("Failed to read template at '" + filePath + "'");
  }
}

export { getPath, readFile };
