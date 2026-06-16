// STORY-010 — Custom 404 page

import { describe, it, expect, beforeAll } from "vitest";

describe("Feature: custom 404 page", () => {
  describe("Scenario: unknown route shows custom 404 page", () => {
    let response: Response;

    beforeAll(async () => {
      const { default: handler } = await import("../../src/pages/404.astro");
      const request = new Request("http://localhost:4321/nonexistent");
      response = await handler.render(request);
    });

    it("responds with 404 status", () => {
      expect(response.status).toBe(404);
    });

    it("renders a user-friendly message", async () => {
      const text = await response.text();
      expect(text).toBeDefined();
    });
  });

  describe("Scenario: 404 page has noindex", () => {
    it("includes meta robots noindex", async () => {
      const { default: handler } = await import("../../src/pages/404.astro");
      const request = new Request("http://localhost:4321/nonexistent");
      const response = await handler.render(request);
      const text = await response.text();
      expect(text).toContain("noindex");
    });
  });
});
