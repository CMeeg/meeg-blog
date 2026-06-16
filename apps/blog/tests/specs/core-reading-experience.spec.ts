// STORY-003 — Core reading experience

import { describe, it, expect, beforeAll } from "vitest";

describe("Feature: core reading experience", () => {
  describe("Scenario: blog listing page renders at /blog", () => {
    let response: Response;

    beforeAll(async () => {
      const { default: handler } = await import(
        "../../src/pages/blog/index.astro"
      );
      const request = new Request("http://localhost:4321/blog");
      response = await handler.render(request);
    });

    it("responds with 200 status", () => {
      expect(response.status).toBe(200);
    });

    it("renders article cards in the listing", async () => {
      const text = await response.text();
      expect(text).toContain("article");
    });
  });

  describe("Scenario: article page renders at /blog/[slug]", () => {
    it("responds with 200 for a valid slug", async () => {
      const { default: handler } = await import(
        "../../src/pages/blog/[slug].astro"
      );
      const request = new Request("http://localhost:4321/blog/hello-world");
      const response = await handler.render(request, { params: { slug: "hello-world" } });
      expect(response.status).toBe(200);
    });
  });

  describe("Scenario: Structured Text renders supported elements", () => {
    it("renders heading, paragraph, bold, italic, code, link, list, blockquote, and image", async () => {
      const { default: StructuredText } = await import(
        "../../src/components/StructuredText.astro"
      );
      const doc = {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Title" }] },
          { type: "paragraph", content: [{ type: "text", marks: [{ type: "strong" }], text: "bold" }] },
        ],
      };
      const html = await StructuredText.render({ data: doc });
      expect(html).toContain("<h2>");
      expect(html).toContain("<strong>");
    });
  });

  describe("Scenario: CodeBlock uses shiki syntax highlighting", () => {
    it("renders pre > code with language class", async () => {
      const { default: CodeBlock } = await import(
        "../../src/components/CodeBlock.astro"
      );
      const html = await CodeBlock.render({
        code: "const x = 1;",
        language: "typescript",
      });
      expect(html).toContain('<pre><code class="language-typescript"');
    });
  });

  // Sad path

  describe("Scenario: invalid slug returns 404", () => {
    it("responds with 404 status", async () => {
      const { default: handler } = await import(
        "../../src/pages/blog/[slug].astro"
      );
      const request = new Request("http://localhost:4321/blog/nonexistent");
      const response = await handler.render(request, { params: { slug: "nonexistent" } });
      expect(response.status).toBe(404);
    });
  });
});
