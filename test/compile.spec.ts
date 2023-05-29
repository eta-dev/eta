/* global it, expect, describe */

import { Eta } from "../src/index";

const eta = new Eta();

const fs = require("fs"),
  path = require("path"),
  filePath = path.join(__dirname, "templates/complex.eta");

const complexTemplate = fs.readFileSync(filePath, "utf8");

describe("Compile test", () => {
  it("parses a simple template", () => {
    const str = eta.compile("hi <%= hey %>");
    expect(str).toBeTruthy();
  });

  it("works with plain string templates", () => {
    const str = eta.compile("hi this is a template");
    expect(str).toBeTruthy();
  });

  it("compiles complex template", () => {
    const str = eta.compile(complexTemplate);
    expect(str).toBeTruthy();
  });

  test("throws with bad inner JS syntax", () => {
    expect(() => {
      eta.compile("<% hi (=h) %>");
    }).toThrow();
  });
});
