// STORY-011 — Visual Editing (Draft Mode, Content Link, Web Previews)

import { describe, it, expect, beforeAll } from "vitest";

describe("Feature: visual editing", () => {
  describe("Scenario: draft mode enable sets signed cookie and redirects", () => {
    let response: Response;

    beforeAll(async () => {
      const { GET } = await import(
        "../../src/pages/api/draft-mode/enable.ts"
      );
      response = await GET(
        new Request(
          "http://localhost:4321/api/draft-mode/enable?token=valid&redirect=/blog/post",
        ),
      );
    });

    it("redirects to the specified path", () => {
      expect(response.status).toBe(302);
    });

    it("sets a cookie with secure flag", () => {
      const setCookie = response.headers.get("set-cookie");
      expect(setCookie).toContain("Secure");
    });

    it("sets cookie with SameSite=None", () => {
      const setCookie = response.headers.get("set-cookie");
      expect(setCookie).toContain("SameSite=None");
    });
  });

  describe("Scenario: draft mode disable removes cookie", () => {
    it("removes the draft mode cookie", async () => {
      const { GET } = await import(
        "../../src/pages/api/draft-mode/disable.ts"
      );
      const response = await GET(
        new Request("http://localhost:4321/api/draft-mode/disable"),
      );
      const setCookie = response.headers.get("set-cookie");
      expect(setCookie).toContain("Max-Age=0");
    });
  });

  describe("Scenario: Web Previews endpoint returns preview links", () => {
    it("returns 200 with previewLinks array", async () => {
      const { POST } = await import(
        "../../src/pages/api/preview-links.ts"
      );
      const response = await POST(
        new Request("http://localhost:4321/api/preview-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item: { meta: { status: "draft" } } }),
        }),
      );
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body).toHaveProperty("previewLinks");
    });
  });

  describe("Scenario: Web Previews handles unmatched records", () => {
    it("returns 200 with empty previewLinks", async () => {
      const { POST } = await import(
        "../../src/pages/api/preview-links.ts"
      );
      const response = await POST(
        new Request("http://localhost:4321/api/preview-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item: { meta: { status: "unknown" } } }),
        }),
      );
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.previewLinks).toEqual([]);
    });
  });

  describe("Scenario: CORS headers on preview-links endpoint", () => {
    it("responds to OPTIONS with Access-Control-Allow-Origin: *", async () => {
      const { OPTIONS } = await import(
        "../../src/pages/api/preview-links.ts"
      );
      const response = await OPTIONS(
        new Request("http://localhost:4321/api/preview-links", {
          method: "OPTIONS",
        }),
      );
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    });
  });

  describe("Scenario: CSP header allows DatoCMS iframe embedding", () => {
    it("includes frame-ancestors in Content-Security-Policy", async () => {
      const { onRequest } = await import("../../src/middleware/index.ts");
      const context = { request: new Request("http://localhost:4321/") };
      let cspValue = "";
      const next = async () => {
        const response = new Response();
        cspValue = response.headers.get("Content-Security-Policy") || "";
      };
      await onRequest(context as any, next);
      expect(cspValue).toContain("frame-ancestors");
    });
  });

  // Sad path

  describe("Scenario: invalid token returns 401", () => {
    it("returns 401 for missing token", async () => {
      const { GET } = await import(
        "../../src/pages/api/draft-mode/enable.ts"
      );
      const response = await GET(
        new Request(
          "http://localhost:4321/api/draft-mode/enable?redirect=/blog/post",
        ),
      );
      expect(response.status).toBe(401);
    });
  });

  describe("Scenario: absolute redirect URL rejected", () => {
    it("returns 422 for absolute redirect", async () => {
      const { GET } = await import(
        "../../src/pages/api/draft-mode/enable.ts"
      );
      const response = await GET(
        new Request(
          "http://localhost:4321/api/draft-mode/enable?token=valid&redirect=https://evil.com",
        ),
      );
      expect(response.status).toBe(422);
    });
  });
});
