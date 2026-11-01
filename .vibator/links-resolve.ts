import { join } from "node:path";
import { defineRule, vibator } from "vibator";
import "./lib/site.ts";

/** The site's origin, as the build writes it into absolute links. */
const origin = "https://vibator.dev";

/** A link found in a page. */
interface FoundLink {
  /** The page's absolute path. */
  readonly page: string;
  /** The link as written. */
  readonly url: string;
  /** Its line in the page. */
  readonly line: number;
}

/** The ids of each page, read once per run. */
const idsByFile = new Map<string, Set<string>>();

/**
 * Lists the `href` and `src` links of a page.
 *
 * @param page - The page's absolute path.
 * @returns The links.
 */
function linksOf(page: string): FoundLink[] {
  return vibator.text
    .matches(vibator.project.files.get(page), /\s(?:href|src)="([^"]+)"/g)
    .map((match) => ({
      page,
      url: match.groups[0] ?? "",
      line: match.line,
    }));
}

/**
 * The site path a link points at, or `undefined` for a link that leaves the site.
 *
 * @param link - The link.
 * @returns The path from the host's root, with its fragment.
 */
function sitePath(link: FoundLink): string | undefined {
  const url = link.url.replaceAll("&amp;", "&");
  if (url.startsWith(`${origin}/`)) return url.slice(origin.length);
  if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) return undefined;
  const from = `https://host${vibator.site.servedPath(link.page)}`;
  return new URL(url, from).pathname + new URL(url, "https://h").hash;
}

/**
 * The ids of a page.
 *
 * @param file - The page's absolute path.
 * @returns Its ids.
 */
function idsOf(file: string): Set<string> {
  const cached = idsByFile.get(file);
  if (cached) return cached;
  const content = vibator.project.files.get(file).content;
  const ids = new Set(
    [...content.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1] ?? ""),
  );
  idsByFile.set(file, ids);
  return ids;
}

/**
 * Tells why a link is broken.
 *
 * @param path - The path it points at, with its fragment.
 * @returns The problem, or `undefined` when the link works.
 */
function problemOf(path: string): string | undefined {
  const [pathname = "", fragment] = path.split("#");
  const inside = decodeURIComponent(pathname.slice(1));
  const dist = vibator.site.dist();
  const folder = inside.endsWith("/") || inside === "";
  if (!folder && vibator.project.exists(join(dist, inside, "index.html")))
    return "The link has no trailing slash.";
  const file = join(dist, folder ? `${inside}index.html` : inside);
  if (!vibator.project.exists(file))
    return "The link names no file of the built site.";
  if (
    fragment &&
    file.endsWith(".html") &&
    !idsOf(file).has(decodeURIComponent(fragment))
  )
    return `The page has no id "${fragment}".`;
  return undefined;
}

export default defineRule({
  id: "links-resolve",
  title:
    "Every internal link of the built site names a file, and every anchor an id",
  check: () => {
    idsByFile.clear();
    return vibator.site
      .files()
      .filter((path) => path.endsWith(".html"))
      .flatMap(linksOf)
      .flatMap((link) => {
        const path = sitePath(link);
        const message = path === undefined ? undefined : problemOf(path);
        if (message === undefined) return [];
        return [
          {
            file: link.page,
            line: link.line,
            message: `${message} (${link.url})`,
            expected:
              "Each internal link opens a page of the site, at an id the page has.",
            fix: "Correct the link in the page source or the doc it comes from, then build again.",
          },
        ];
      });
  },
});
