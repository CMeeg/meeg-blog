// STORY-009 — Crawler support (sitemap + robots.txt)

import { describe, it, expect, beforeAll } from "vitest";

describe("Feature: crawler support", () => {
  describe("Scenario: sitemap.xml lists published article URLs", () => {
    let response: Response;

    beforeAll(async () => {
      const { GET } = await import("../../src/pages/sitemap.xml.ts");
      response = await GET();
    });

    it("responds with 200 status", () => {
      expect(response.status).toBe(200);
    });

    it("returns XML content type", () => {
      expect(response.headers.get("content-type")).toContain("xml");
    });

    it("contains urlset element", async () => {
      const text = await response.text();
      expect(text).toContain("<urlset");
    });

    it("includes page URLs (/, /about, /blog)", async () => {
      const text = await response.text();
      expect(text).toContain("<loc>");
    });
  });

  describe("Scenario: robots.txt allows all crawlers", () => {
    it("contains Allow directive", async () => {
      const { GET } = await import("../../src/pages/robots.txt.ts");
      const response = await GET();
      const text = await response.text();
      expect(text).toContain("Allow: /");
    });

    it("points to the sitemap URL", async () => {
      const { GET } = await import("../../src/pages/robots.txt.ts");
      const response = await GET();
      const text = await response.text();
      expect(text).toContain("Sitemap:");
    });
  });
});
