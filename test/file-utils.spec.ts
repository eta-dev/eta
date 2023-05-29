/* global it, expect, describe */

import path from "node:path";

import { Eta } from "../src/index";

const viewsDir = path.join(__dirname, "templates");

const eta = new Eta({ views: viewsDir, cache: true });

describe("Filepath caching", () => {
  it("Filepath caching works as expected", async () => {
    // This test renders templates/has-include.eta with caching enabled, then checks to make sure
    // `config.filepathCache` contains the expected result afterward

    const templateResult = await eta.render("has-include", {});

    expect(templateResult).toEqual(
      `This is the outermost template. Now we'll include a partial

===========================================================
This is a partial.
Hi Test Runner`
    );

    // The cache is indexed by {filename, path, root, views} (JSON.stringify ignores keys with undefined as their value)

    // Filepath caching is based on the premise that given the same path, includer filename, root directory, and views directory (or directories)
    // the getPath function will always return the same result (assuming that caching is enabled and we're not expecting the templates to change)

    const pathToPartial = `{"filename":"${viewsDir}/has-include.eta","path":"./partial","views":"${viewsDir}"}`;

    const pathToSimple = `{"filename":"${viewsDir}/partial.eta","path":"./simple","views":"${viewsDir}"}`;

    expect(eta.filepathCache).toEqual({
      [pathToPartial]: `${viewsDir}/partial.eta`,
      [pathToSimple]: `${viewsDir}/simple.eta`,
    });
  });
});
