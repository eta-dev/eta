var fs = require('fs')
var path = require('path')
var _BOM = /^\uFEFF/

// express is set like: app.engine('html', require('squirrelly').renderFile)

import SqrlErr from './err'
import Compile from './compile'
import { getConfig } from './config'

/* TYPES */

import { SqrlConfig, PartialConfig } from './config'
import { TemplateFunction } from './compile'

interface PartialFileConfig extends PartialConfig {
  filename: string
}

interface FileConfig extends SqrlConfig {
  filename: string
}

/* END TYPES */

/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * @param {String}  name       specified path
 * @param {String}  parentfile parent file path
 * @param {Boolean} [isDir=false] whether parent file path is a directory
 * @return {String}
 */

function getWholeFilePath (name: string, parentfile: string, isDirectory?: boolean) {
  var includePath = path.resolve(
    isDirectory ? parentfile : path.dirname(parentfile), // returns directory the parent file is in
    name // file
  )
  var ext = path.extname(name)
  if (!ext) {
    includePath += '.sqrl'
  }
  return includePath
}

/**
 * Get the path to the included file by Options
 *
 * @param  {String}  path    specified path
 * @param  {Options} options compilation options
 * @return {String}
 */

function getPath (path: string, options: SqrlConfig) {
  var includePath
  var filePath
  var views = options.views
  var match = /^[A-Za-z]+:\\|^\//.exec(path)

  // Abs path
  if (match && match.length) {
    includePath = getWholeFilePath(path.replace(/^\/*/, ''), options.root || '/', true)
  } else {
    // Relative paths
    // Look relative to a passed filename first
    if (options.filename) {
      filePath = getWholeFilePath(path, options.filename)
      if (fs.existsSync(filePath)) {
        includePath = filePath
      }
    }
    // Then look in any views directories
    if (!includePath) {
      if (
        Array.isArray(views) &&
        views.some(function (v) {
          filePath = getWholeFilePath(path, v, true)
          return fs.existsSync(filePath)
        })
      ) {
        includePath = filePath
      }
    }
    if (!includePath) {
      throw SqrlErr('Could not find the include file "' + path + '"')
    }
  }
  return includePath
}

function readFile (filePath: string) {
  return fs
    .readFileSync(filePath)
    .toString()
    .replace(_BOM, '') // TODO: is replacing BOM's necessary?
}

function loadFile (filePath: string, options: PartialFileConfig): TemplateFunction {
  var config = getConfig(options)
  var template = readFile(filePath)
  try {
    var compiledTemplate = Compile(template, config)
    config.storage.templates.define((config as FileConfig).filename, compiledTemplate)
    return compiledTemplate
  } catch (e) {
    throw SqrlErr('Loading file: ' + filePath + ' failed')
  }
}

export { getPath, readFile, loadFile }
