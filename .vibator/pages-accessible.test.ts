import { describe, expect, it } from "bun:test";
import { runRule } from "vibator/testing";
import rule from "./pages-accessible.ts";

/** A built page with a language, a title, and the given body. */
const page = (body: string) =>
  `<!doctype html><html lang="en"><head><title>Page</title></head><body><main>${body}</main></body></html>`;

describe("pages-accessible", () => {
  it("reports an image without alt text in every view", async () => {
    const findings = await runRule(rule, {
      files: { "dist/index.html": page('<h1>Home</h1><img src="a.png">') },
    });
    expect(findings.map((finding) => finding.message.split(" (")[0])).toEqual([
      "image-alt on img",
      "image-alt on img",
      "image-alt on img",
      "image-alt on img",
    ]);
    expect(findings[0]?.file).toBe("dist/index.html");
  }, 60_000);

  it("passes an accessible page and skips redirect pages", async () => {
    const findings = await runRule(rule, {
      files: {
        "dist/index.html": page("<h1>Home</h1><p>Text.</p>"),
        "dist/old/index.html":
          '<!doctype html><meta http-equiv="refresh" content="0;url=/"><img src="a.png">',
      },
    });
    expect(findings).toEqual([]);
  }, 60_000);
});
