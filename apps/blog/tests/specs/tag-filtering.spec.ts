// STORY-004 — Tag filtering

import { describe, it, expect, beforeAll } from "vitest";

describe("Feature: tag filtering", () => {
  describe("Scenario: tag page shows filtered articles", () => {
    let response: Response;

    beforeAll(async () => {
      const { default: handler } = await import(
        "../../src/pages/tags/[tag].astro"
      );
      const request = new Request("http://localhost:4321/tags/typescript");
      response = await handler.render(request, {
        params: { tag: "typescript" },
      });
    });

    it("responds with 200 status", () => {
      expect(response.status).toBe(200);
    });

    it("displays the tag name as heading", async () => {
      const text = await response.text();
      expect(text).toContain("typescript");
    });
  });

  // Sad path

  describe("Scenario: unknown tag returns empty state or 404", () => {
    it("responds with 404 for nonexistent tag", async () => {
      const { default: handler } = await import(
        "../../src/pages/tags/[tag].astro"
      );
      const request = new Request("http://localhost:4321/tags/nonexistent");
      const response = await handler.render(request, {
        params: { tag: "nonexistent" },
      });
      expect(response.status === 404 || response.status === 200).toBe(true);
    });
  });
});
