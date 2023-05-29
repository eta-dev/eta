/* global it, expect, describe */

import { Eta } from "../src/index";

describe("basic functionality", () => {
  const eta = new Eta();

  it("renderString: template compiles", () => {
    expect(eta.renderString("Hi <%= it.name%>", { name: "Ada Lovelace" })).toEqual(
      "Hi Ada Lovelace"
    );
  });
  it("renderString: string trimming", () => {
    expect(eta.renderString("Hi \n<%- =it.name_%>  !", { name: "Ada Lovelace" })).toEqual(
      "Hi Ada Lovelace!"
    );
  });
  it("render: passing in a template function", () => {
    expect(eta.render(eta.compile("Hi \n<%- =it.name_%>  !"), { name: "Ada Lovelace" })).toEqual(
      "Hi Ada Lovelace!"
    );
  });
});

describe("render caching", () => {
  const eta = new Eta({ cache: true });

  eta.loadTemplate("@template1", "Hi <%=it.name%>");

  it("Simple template caches", () => {
    expect(eta.render("@template1", { name: "Ada Lovelace" })).toEqual("Hi Ada Lovelace");

    expect(eta.templatesSync.get("@template1")).toBeTruthy();
  });
});

describe("Renders with different scopes", () => {
  it("Puts `it` in global scope with env.useWith", () => {
    const etaWithUseWith = new Eta({ useWith: true });

    expect(etaWithUseWith.renderString("Hi <%=name%>", { name: "Ada Lovelace" })).toEqual(
      "Hi Ada Lovelace"
    );
  });
});
