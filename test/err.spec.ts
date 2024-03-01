/* global it, expect, describe */

import path from "path";
import { Eta, EtaParseError, EtaRuntimeErr } from "../src/index";

describe("ParseErr", () => {
  const eta = new Eta();

  it("error while parsing", () => {
    try {
      eta.renderString("template <%", {});
    } catch (ex) {
      expect(ex).toBeInstanceOf(EtaParseError);
      expect((ex as EtaParseError).name).toBe("EtaParser Error");
      expect((ex as EtaParseError).message).toBe(`unclosed tag at line 1 col 10:

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
      expect(ex).toBeInstanceOf(EtaRuntimeErr);
      expect((ex as EtaRuntimeErr).name).toBe("ReferenceError");
      expect((ex as EtaRuntimeErr).message).toBe(`${errorFilepath}:2
    1| 
 >> 2| <%= undefinedVariable %>
    3| Lorem Ipsum

undefinedVariable is not defined`);
    }
  });
});
