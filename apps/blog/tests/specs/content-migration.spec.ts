// STORY-002 — Content migration

import { describe, it, expect, beforeAll } from "vitest";

describe("Feature: content migration from Storyblok to Dato CMS", () => {
  describe("Scenario: migration script reads local Storyblok export", () => {
    it("parses Storyblok story JSON into an internal representation", async () => {
      const { readStoryblokExport } = await import(
        "../../../packages/storyblok-migration/src/index"
      );
      const stories = await readStoryblokExport(".storyblok/stories");
      expect(Array.isArray(stories)).toBe(true);
    });
  });

  describe("Scenario: Article record is created from mapped Storyblok story", () => {
    let record: unknown;

    beforeAll(async () => {
      const { mapStoryToArticle } = await import(
        "../../../packages/storyblok-migration/src/index"
      );
      const sampleStory = {
        name: "My First Post",
        slug: "my-first-post",
        content: {
          summary: "A test post",
          body: { type: "doc", content: [] },
          publish_date: "2026-01-15",
          tags: [{ name: "typescript" }],
        },
      };
      record = mapStoryToArticle(sampleStory);
    });

    it("maps title from story name", () => {
      expect(record).toHaveProperty("title", "My First Post");
    });

    it("maps slug from story slug", () => {
      expect(record).toHaveProperty("slug", "my-first-post");
    });

    it("maps summary from content field", () => {
      expect(record).toHaveProperty("summary", "A test post");
    });

    it("maps publish_date correctly", () => {
      expect(record).toHaveProperty("publish_date", "2026-01-15");
    });
  });
});
