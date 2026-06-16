// STORY-001 — Project foundation

import { describe, it, expect, beforeAll } from "vitest";

describe("Feature: project foundation", () => {
  describe("Scenario: CDA client returns published content", () => {
    let result: unknown;

    beforeAll(async () => {
      const { executeQuery } = await import(
        "../../src/lib/datocms/executeQuery"
      );
      result = await executeQuery(`{ allArticles { id title } }`);
    });

    it("returns a defined result with data property", () => {
      expect(result).toBeDefined();
      expect(result).toHaveProperty("data");
    });
  });

  describe("Scenario: draft mode flag is detected from cookies", () => {
    it("returns false when no draft cookie is present", async () => {
      const { isDraftModeEnabled } = await import(
        "../../src/lib/datocms/executeQuery"
      );
      const cookies = { get: () => undefined };
      expect(isDraftModeEnabled(cookies as any)).toBe(false);
    });
  });

  describe("Scenario: BaseLayout renders valid HTML5 document", () => {
    let html: string;

    beforeAll(async () => {
      const { default: BaseLayout } = await import(
        "../../src/layouts/BaseLayout.astro"
      );
      const result = await BaseLayout.render({});
      html = result;
    });

    it("renders DOCTYPE html declaration", () => {
      expect(html).toContain("<!DOCTYPE html>");
    });

    it("renders html element", () => {
      expect(html).toContain("<html");
    });

    it("renders head element", () => {
      expect(html).toContain("<head>");
    });

    it("renders body element", () => {
      expect(html).toContain("<body>");
    });
  });
});
