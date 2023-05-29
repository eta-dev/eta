/* global it, expect, describe */

import { Eta } from "../src/index";
import { parse } from "../src/parse";

const eta = new Eta();

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "templates/complex.eta");

const complexTemplate = fs.readFileSync(filePath, "utf8");

describe("parse test", () => {
  it("parses a simple template", () => {
    const buff = parse.call(eta, "hi <%= hey %>");
    expect(buff).toEqual(["hi ", { val: "hey", t: "i" }]);
  });

  it("parses a raw tag", () => {
    const buff = parse.call(eta, "hi <%~ hey %>");
    expect(buff).toEqual(["hi ", { val: "hey", t: "r" }]);
  });

  it("works with whitespace trimming", () => {
    const buff = parse.call(eta, "hi\n<%- = hey-%> <%_ = hi _%>");
    expect(buff).toEqual(["hi", { val: "hey", t: "i" }, { val: "hi", t: "i" }]);
  });

  it("works with multiline comments", () => {
    const buff = parse.call(eta, "hi <% /* comment contains delimiter %> */ %>");
    expect(buff).toEqual(["hi ", { val: "/* comment contains delimiter %> */", t: "e" }]);
  });

  it("parses with simple template literal", () => {
    const buff = parse.call(eta, "hi <%= `template %> ${value}` %>");
    expect(buff).toEqual(["hi ", { val: "`template %> ${value}`", t: "i" }]);
  });

  it("compiles complex template", () => {
    const buff = parse.call(eta, complexTemplate);
    expect(buff).toEqual([
      "Hi\\n",
      { t: "e", val: 'console.log("Hope you like Eta!")' },
      { t: "i", val: "it.htmlstuff" },
      "\\n",
      { t: "e", val: "for (var key in it.obj) {" },
      "Value: ",
      { t: "i", val: "it.obj[key]" },
      ", Key: ",
      { t: "i", val: "key" },
      "\\n",
      { t: "e", val: "if (key === 'thirdchild') {" },
      "  ",
      {
        t: "e",
        val: "for (var i = 0, arr = it.obj[key]; i < arr.length; i++) {",
      },
      "      Salutations! Index: ",
      { t: "i", val: "i" },
      ", parent key: ",
      { t: "i", val: "key" },
      "      \\n  ",
      { t: "e", val: "}" },
      { t: "e", val: "}" },
      { t: "e", val: "}" },
      "\\nThis is a partial: ",
      { t: "r", val: 'include("mypartial")' },
    ]);
  });

  test("throws with unclosed tag", () => {
    expect(() => {
      parse.call(eta, '<%hi("hey")');
    }).toThrowError("hi");
  });

  test("throws with unclosed single-quote string", () => {
    expect(() => {
      parse.call(eta, "<%= ' %>");
    }).toThrowError(`unclosed string at line 1 col 5:

  <%= ' %>
      ^`);
  });

  test("throws with unclosed double-quote string", () => {
    expect(() => {
      parse.call(eta, '<%= " %>');
    }).toThrowError(`unclosed string at line 1 col 5:

  <%= " %>
      ^`);
  });

  test("throws with unclosed template literal", () => {
    expect(() => {
      parse.call(eta, "<%= ` %>");
    }).toThrowError(`unclosed string at line 1 col 5:

  <%= \` %>
      ^`);
  });

  test("throws with unclosed multi-line comment", () => {
    expect(() => {
      parse.call(eta, "<%= /* %>");
    }).toThrowError(`unclosed comment at line 1 col 5:

  <%= /* %>
      ^`);
  });
});
