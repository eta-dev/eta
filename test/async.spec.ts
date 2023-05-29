/* global it, expect, describe */

import { Eta } from "../src/index";

const eta = new Eta();

function resolveAfter2Seconds(val: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, 20);
  });
}

async function asyncTest() {
  const result = await resolveAfter2Seconds("HI FROM ASYNC");
  return result;
}

describe("Async Render checks", () => {
  describe("Async works", () => {
    it("compiles asynchronously", async () => {
      expect(await eta.renderStringAsync("Hi <%= it.name %>", { name: "Ada Lovelace" })).toEqual(
        "Hi Ada Lovelace"
      );
    });

    it("async function works", async () => {
      expect(
        await eta.renderStringAsync("<%= await it.asyncTest() %>", {
          asyncTest: asyncTest,
        })
      ).toEqual("HI FROM ASYNC");
    });

    it("Async template w/ syntax error throws", async () => {
      await expect(async () => {
        await eta.renderStringAsync("<%= @#$%^ %>", {});
      }).rejects.toThrow();
    });
  });
});
