// STORY-006 — About page

import { describe, it, expect, beforeAll } from "vitest";

describe("Feature: about page", () => {
  describe("Scenario: about page shows author info", () => {
    let response: Response;

    beforeAll(async () => {
      const { default: handler } = await import(
        "../../src/pages/about.astro"
      );
      const request = new Request("http://localhost:4321/about");
      response = await handler.render(request);
    });

    it("responds with 200 status", () => {
      expect(response.status).toBe(200);
    });

    it("renders the author name", async () => {
      const text = await response.text();
      expect(text).toBeDefined();
    });
  });
});
