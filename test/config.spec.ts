/* global it, expect, describe */

import { Eta } from "../src/index";

describe("Config Tests", () => {
  it("custom tags", () => {
    const eta = new Eta({ tags: ["<<", ">>"] });
    const res = eta.renderString("hi <<= it.name >>", { name: "Ben" });
    expect(res).toEqual("hi Ben");
  });

  it("no autoescape", () => {
    const eta = new Eta({ autoEscape: false });
    const res = eta.renderString("<%= it.html %>", { html: "<p>Hi</p>" });
    expect(res).toEqual("<p>Hi</p>"); // not escaped
  });

  it("default filter function stringifies data", () => {
    const eta = new Eta();

    expect(eta.config.filterFunction({ a: 1 })).toEqual("[object Object]");
  });

  it("filter function", () => {
    const template = "My favorite food is <%= it.fav %>";
    const baseEta = new Eta();

    expect(baseEta.renderString(template, {})).toEqual("My favorite food is undefined");

    const etaWithSimpleFilter = new Eta({
      autoFilter: true,
      // turn every value into "apples"
      filterFunction: (_val) => "apples",
    });

    expect(etaWithSimpleFilter.renderString(template, {})).toEqual("My favorite food is apples");
  });

  it("complex filter function", () => {
    let timesFilterCalled = 0;
    const eta = new Eta({
      autoFilter: true,
      filterFunction: function () {
        timesFilterCalled++;
        if (timesFilterCalled <= 1) {
          return "The first";
        } else {
          return "another";
        }
      },
    });

    expect(eta.renderString("<%= it.val1 %>, <%~ it.val2 %>, <%~ it.val3 %>", {})).toEqual(
      "The first, another, another"
    );
  });

  it("withConfig", () => {
    const eta = new Eta();

    const res = eta
      .withConfig({ tags: ["{{", "}}"] })
      .renderString("{{= it.name }}", { name: "John Appleseed" });

    expect(res).toEqual("John Appleseed");

    // the original tags should remain unchanged
    expect(eta.config.tags).toEqual(["<%", "%>"]);
  });

  it("configure", () => {
    const eta = new Eta();

    eta.configure({ tags: ["{{", "}}"] });

    const res = eta.renderString("{{= it.name }}", { name: "John Appleseed" });

    expect(res).toEqual("John Appleseed");

    // the original tags should have changed
    expect(eta.config.tags).toEqual(["{{", "}}"]);
  });
});
