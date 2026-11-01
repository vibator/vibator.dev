import { describe, expect, it } from "bun:test";
import { runRule } from "vibator/testing";
import rule from "./links-resolve.ts";

/** A built page with the given body. */
const page = (body: string) =>
  `<!doctype html><html><body>${body}</body></html>`;

describe("links-resolve", () => {
  it("reports a missing page and a missing anchor", async () => {
    const findings = await runRule(rule, {
      files: {
        "dist/index.html": page(
          '<a href="/docs/">Docs</a>\n<a href="/gone/">Gone</a>\n<a href="/docs/#nope">Nope</a>',
        ),
        "dist/docs/index.html": page('<h1 id="intro">Docs</h1>'),
      },
    });
    expect(
      findings.map(({ file, line, message }) => ({ file, line, message })),
    ).toEqual([
      {
        file: "dist/index.html",
        line: 2,
        message: "The link names no file of the built site. (/gone/)",
      },
      {
        file: "dist/index.html",
        line: 3,
        message: 'The page has no id "nope". (/docs/#nope)',
      },
    ]);
  });

  it("reports a link to a folder without a trailing slash", async () => {
    const findings = await runRule(rule, {
      files: {
        "dist/index.html": page('<a href="/docs">Docs</a>'),
        "dist/docs/index.html": page("Docs"),
      },
    });
    expect(findings.map((finding) => finding.message)).toEqual([
      "The link has no trailing slash. (/docs)",
    ]);
  });

  it("passes relative links, anchors, absolute site links, and external links", async () => {
    const findings = await runRule(rule, {
      files: {
        "dist/index.html": page(
          '<a id="top" href="#top">Top</a><a href="docs/#intro">Intro</a><a href="https://vibator.dev/docs/">Docs</a><a href="https://github.com/vibator">GitHub</a>',
        ),
        "dist/docs/index.html": page('<h1 id="intro">Docs</h1>'),
      },
    });
    expect(findings).toEqual([]);
  });

  it("finds nothing before a build", async () => {
    expect(await runRule(rule, { files: { "README.md": "# Site\n" } })).toEqual(
      [],
    );
  });
});
