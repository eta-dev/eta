/* global it, expect, describe */

import path from "node:path";

import { Eta } from "../src/index";

const eta = new Eta({ views: path.join(__dirname, "templates") });

describe("Layout Tests", () => {
  it("Nested layouts work as expected", () => {
    const res = eta.render("index.eta", { title: "Cool Title" });

    expect(res).toEqual(`<!DOCTYPE html>
<html lang="en">
<head>
    <title>Cool Title</title>
</head>
<body>
This is the template body.
</body>
</html>`);
  });

  it("Layouts are called with arguments if they're provided", async () => {
    eta.loadTemplate(
      "@my-layout",
      `<%= it.title %> - <%~ it.body %> - <%~ it.content %> - <%~ it.randomNum %>`
    );

    const res = await eta.renderString(
      `<% layout("@my-layout", { title: 'Nifty title', content: 'Nice content'}) %>
This is a layout`,
      { title: "Cool Title", randomNum: 3 }
    );

    // Note that layouts automatically accept the data of the template which called them,
    // after it is merged with { body:__eta.res } and `it`

    expect(res).toEqual("Nifty title - This is a layout - Nice content - 3");
  });
});
