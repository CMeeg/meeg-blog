// STORY-007 — Site chrome (navigation, footer, theme toggle)

import { describe, it, expect, beforeAll } from "vitest";

describe("Feature: site chrome", () => {
  describe("Scenario: header renders navigation links from Global Settings", () => {
    it("renders navigation markup", async () => {
      const { default: Header } = await import(
        "../../src/components/Header.astro"
      );
      const html = await Header.render({});
      expect(html).toContain("nav");
    });
  });

  describe("Scenario: footer renders copyright and social links", () => {
    it("renders footer markup", async () => {
      const { default: Footer } = await import(
        "../../src/components/Footer.astro"
      );
      const html = await Footer.render({});
      expect(html).toContain("footer");
    });
  });

  describe("Scenario: theme toggle switches between light and dark", () => {
    it("sets data-theme attribute on html element", async () => {
      const { default: BaseLayout } = await import(
        "../../src/layouts/BaseLayout.astro"
      );
      const result = await BaseLayout.render({});
      expect(result).toContain("data-theme");
    });
  });

  describe("Scenario: theme preference persists across page loads", () => {
    it("reads theme from localStorage on load", async () => {
      const { default: BaseLayout } = await import(
        "../../src/layouts/BaseLayout.astro"
      );
      const result = await BaseLayout.render({});
      expect(result).toContain("localStorage");
    });
  });

  describe("Scenario: no flash of wrong theme", () => {
    it("includes critical inline script in head before paint", async () => {
      const { default: BaseLayout } = await import(
        "../../src/layouts/BaseLayout.astro"
      );
      const result = await BaseLayout.render({});
      const headEnd = result.indexOf("</head>");
      const scriptInHead = result.lastIndexOf("<script", headEnd);
      expect(scriptInHead).not.toBe(-1);
    });
  });
});
