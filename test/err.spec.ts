/* global it, expect, describe */

import path from "path";
import { Eta, EtaParseError, EtaRuntimeErr, EtaFileResolutionError } from "../src/index";

describe("ParseErr", () => {
  const eta = new Eta();

  it("error while parsing - renderString", () => {
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

  it("error while parsing - compile", () => {
    try {
      eta.compile("template <%");
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

describe("EtaFileResolutionError", () => {
  it("error throws correctly when template does not exist", () => {
    const eta = new Eta({ debug: true, views: path.join(__dirname, "templates") });
    const errorFilepath = path.join(__dirname, "templates/not-existing-template.eta");

    try {
      eta.render("./not-existing-template", {});
    } catch (ex) {
      expect(ex).toBeInstanceOf(EtaFileResolutionError);
      expect((ex as EtaFileResolutionError).name).toBe("EtaFileResolution Error");
      expect((ex as EtaFileResolutionError).message).toBe(
        `Could not find template: ${errorFilepath}`
      );
    }
  });

  it("error throws correctly when views options is missing", async () => {
    const eta = new Eta({ debug: true });
    try {
      eta.render("Hi", {});
    } catch (ex) {
      expect(ex).toBeInstanceOf(EtaFileResolutionError);
      expect((ex as EtaFileResolutionError).name).toBe("EtaFileResolution Error");
      expect((ex as EtaFileResolutionError).message).toBe("Views directory is not defined");
    }

    try {
      await eta.renderAsync("Hi", {});
    } catch (ex) {
      expect(ex).toBeInstanceOf(EtaFileResolutionError);
      expect((ex as EtaFileResolutionError).name).toBe("EtaFileResolution Error");
      expect((ex as EtaFileResolutionError).message).toBe("Views directory is not defined");
    }
  });

  it("error throws correctly when template in not in th view directory", () => {
    const eta = new Eta({ debug: true, views: path.join(__dirname, "templates") });

    const filePath = "../../../simple.eta";
    try {
      eta.render(filePath, {});
    } catch (ex) {
      expect(ex).toBeInstanceOf(EtaFileResolutionError);
      expect((ex as EtaFileResolutionError).name).toBe("EtaFileResolution Error");
      expect((ex as EtaFileResolutionError).message).toBe(
        `Template '${filePath}' is not in the views directory`
      );
    }
  });
});
