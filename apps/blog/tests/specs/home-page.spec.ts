// STORY-005 — Home page

import { describe, it, expect, beforeAll } from "vitest";

describe("Feature: home page", () => {
  describe("Scenario: home page shows recent articles", () => {
    let response: Response;

    beforeAll(async () => {
      const { default: handler } = await import("../../src/pages/index.astro");
      const request = new Request("http://localhost:4321/");
      response = await handler.render(request);
    });

    it("responds with 200 status", () => {
      expect(response.status).toBe(200);
    });

    it("displays the site title", async () => {
      const text = await response.text();
      expect(text).toContain("meeg-blog");
    });

    it("displays article cards for recent posts", async () => {
      const text = await response.text();
      expect(text).toContain("article");
    });
  });
});
