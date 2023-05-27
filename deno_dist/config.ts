/* TYPES */

type trimConfig = "nl" | "slurp" | false;

export interface Options {
  /** Compile to async function */
  async?: boolean;

  /** Absolute path to template file */
  filepath?: string;
}

export interface EtaConfig {
  /** Whether or not to automatically XML-escape interpolations. Default true */
  autoEscape: boolean;

  /** Configure automatic whitespace trimming. Default `[false, 'nl']` */
  autoTrim: trimConfig | [trimConfig, trimConfig];

  /** Whether or not to cache templates if `name` or `filename` is passed */
  cache: boolean;

  // TODO: Mention that Eta can't use "-" or "_" for config.parse since they're used for whitespace slurping.

  /** Parsing options */
  parse: {
    /** Which prefix to use for evaluation. Default `""` */
    exec: string;

    /** Which prefix to use for interpolation. Default `"="` */
    interpolate: string;

    /** Which prefix to use for raw interpolation. Default `"~"` */
    raw: string;
  };

  /** Array of plugins */
  plugins: Array<
    {
      processFnString?: Function;
      processAST?: Function;
      processTemplate?: Function;
    }
  >;

  /** Holds cache of resolved filepaths. Set to `false` to disable. */
  filepathCache?: Record<string, string> | false;

  /** Apply a filter function defined on the class to every interpolation or raw interpolation */
  filter?: boolean;

  /** Remove all safe-to-remove whitespace */
  rmWhitespace: boolean;

  /** Delimiters: by default `['<%', '%>']` */
  tags: [string, string];

  /** Make data available on the global object instead of varName */
  useWith?: boolean;

  /** Name of the data object. Default `it` */
  varName: string;

  /** Directory that contains templates */
  views?: string;
}

/* END TYPES */

/** Eta's base (global) configuration */
const defaultConfig: EtaConfig = {
  autoEscape: true,
  autoTrim: [false, "nl"],
  cache: false,
  filepathCache: {},
  parse: {
    exec: "",
    interpolate: "=",
    raw: "~",
  },
  plugins: [],
  rmWhitespace: false,
  tags: ["<%", "%>"],
  useWith: false,
  varName: "it",
};

export { defaultConfig };
