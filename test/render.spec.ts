/* global it, expect, describe */

import { Eta } from "../src/index";

const eta = new Eta();

describe("basic functionality", () => {
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
  it("renderStringAsync", async () => {
    const template = "Hello <%= await it.getName() %>!";
    const getName = () => {
      return new Promise((res) => {
        setTimeout(() => {
          res("Ada");
        }, 20);
      });
    };
    expect(await eta.renderStringAsync(template, { getName })).toEqual("Hello Ada!");
  });
});

// describe("render caching", () => {
//   it("Simple template caches", () => {
//     eta.renderString();
//     render("Hi <%=it.name%>", { name: "Ada Lovelace" }, { cache: true, name: "template1" });
//     expect(eta.templatesSync.get("template1")).toBeTruthy();
//   });

//   it("Simple template works again", () => {
//     expect(
//       render("This shouldn't show up", { name: "Ada Lovelace" }, { cache: true, name: "template1" })
//     ).toEqual("Hi Ada Lovelace");
//   });
// });

describe("Renders with different scopes", () => {
  it("Puts `it` in global scope with env.useWith", () => {
    const etaWithUseWith = new Eta({ useWith: true });

    expect(etaWithUseWith.renderString("Hi <%=name%>", { name: "Ada Lovelace" })).toEqual(
      "Hi Ada Lovelace"
    );
  });
});
