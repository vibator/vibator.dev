/** Rewrites a doc's relative links: to a page of the same docs version, or to GitHub at its ref. */
import { directoryOf, publishedSlug, resolveRepoPath } from "./doc-paths.ts";
import { githubUrl } from "./project.ts";
import { joinBase } from "./url.ts";

/** Where a file's links lead: the version of the docs it belongs to. */
export interface DocPlace {
  /** The site path of the version's docs, such as `docs/` or `docs/v3.0/`. */
  readonly docsPath: string;
  /** The git ref other repository files are read at on GitHub: a tag, or `main`. */
  readonly ref: string;
}

/**
 * Tells whether a link stays as written: a scheme, a rooted path, or an anchor on the same page.
 *
 * @param url The link as written.
 * @returns `true` when the link stays as written.
 */
function keepsAsWritten(url: string): boolean {
  return url === "" || /^([a-z][a-z0-9+.-]*:|\/|#)/i.test(url);
}

/**
 * Splits a link into its path and its `#fragment`.
 *
 * @param url The link.
 * @returns The path, and the fragment with its `#`, or empty.
 */
function splitFragment(url: string): { path: string; fragment: string } {
  const index = url.indexOf("#");
  if (index === -1) return { path: url, fragment: "" };
  return { path: url.slice(0, index), fragment: url.slice(index) };
}

/**
 * Rewrites one link of a repository Markdown file into its site or GitHub address.
 *
 * @param url The link as written, such as `../design/configuration.md#rules`.
 * @param fromRepoPath The path of the file it is written in, from the repository root.
 * @param siteBase The site's base path, such as `/`.
 * @param place The version the file belongs to.
 * @returns `<base><docs path><slug>/#fragment` for a published doc, a GitHub address for any
 * other repository path, and the link unchanged when it is not relative.
 */
export function rewriteDocLink(
  url: string,
  fromRepoPath: string,
  siteBase: string,
  place: DocPlace,
): string {
  if (keepsAsWritten(url)) return url;
  const { path, fragment } = splitFragment(url);
  const repoPath = resolveRepoPath(directoryOf(fromRepoPath), path);
  if (repoPath === undefined) return url;
  const slug = publishedSlug(repoPath);
  if (slug !== undefined) {
    return `${joinBase(siteBase, `${place.docsPath}${slug}/`)}${fragment}`;
  }
  return `${githubUrl(repoPath, place.ref)}${fragment}`;
}
