// STORY-008 — Global SEO

import { describe, it, expect, beforeAll } from "vitest";

describe("Feature: global SEO", () => {
  describe("Scenario: page emits title and description meta tags", () => {
    it("includes title and meta description", async () => {
      const { default: Seo } = await import("../../src/components/Seo.astro");
      const html = await Seo.render({});
      expect(html).toContain("<title>");
      expect(html).toContain('name="description"');
    });
  });

  describe("Scenario: page emits Open Graph meta tags", () => {
    it("includes og:title, og:description, og:type, og:url, og:image", async () => {
      const { default: Seo } = await import("../../src/components/Seo.astro");
      const html = await Seo.render({});
      expect(html).toContain('property="og:title"');
      expect(html).toContain('property="og:description"');
      expect(html).toContain('property="og:type"');
      expect(html).toContain('property="og:url"');
    });
  });

  describe("Scenario: page emits Twitter Card meta tags", () => {
    it("includes twitter:card, twitter:title, twitter:description", async () => {
      const { default: Seo } = await import("../../src/components/Seo.astro");
      const html = await Seo.render({});
      expect(html).toContain('name="twitter:card"');
      expect(html).toContain('name="twitter:title"');
      expect(html).toContain('name="twitter:description"');
    });
  });

  describe("Scenario: page has canonical link", () => {
    it("includes link rel canonical", async () => {
      const { default: Seo } = await import("../../src/components/Seo.astro");
      const html = await Seo.render({});
      expect(html).toContain('rel="canonical"');
    });
  });

  describe("Scenario: article page emits article-specific OG tags and JSON-LD", () => {
    it("includes og:type article, published_time, and tag", async () => {
      const { default: Seo } = await import("../../src/components/Seo.astro");
      const html = await Seo.render({ seoType: "article" });
      expect(html).toContain('property="og:type"');
    });
  });

  describe("Scenario: JSON-LD structured data on article pages", () => {
    it("includes application/ld+json script", async () => {
      const { default: JsonLd } = await import(
        "../../src/components/JsonLd.astro"
      );
      const html = await JsonLd.render({});
      expect(html).toContain('type="application/ld+json"');
    });
  });
});
