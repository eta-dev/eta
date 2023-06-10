/* global it, expect, describe */

import path from "path";
import { Eta } from "../src/index";

describe("ParseErr", () => {
  const eta = new Eta();

  it("error while parsing", () => {
    try {
      eta.renderString("template <%", {});
    } catch (ex) {
      expect((ex as Error).name).toBe("Eta Error");
      expect((ex as Error).message).toBe(`unclosed tag at line 1 col 10:

  template <%
           ^`);
      expect(ex instanceof Error).toBe(true);
    }
  });
});

describe("RuntimeErr", () => {
  const eta = new Eta({ debug: true, views: path.join(__dirname, "templates") });

  const errorFilepath = path.join(__dirname, "templates/runtime-error.eta");

  it("error throws correctly", () => {
    try {
      eta.render("./runtime-error", {});
    } catch (ex) {
      expect((ex as Error).name).toBe("ReferenceError");
      expect((ex as Error).message).toBe(`${errorFilepath}:2
    1| 
 >> 2| <%= undefinedVariable %>
    3| Lorem Ipsum

undefinedVariable is not defined`);
    }
  });
});
