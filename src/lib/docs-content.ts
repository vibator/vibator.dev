/** The docs as the site publishes them, per version: each page's slug, title and description. */
import { type CollectionEntry, getCollection } from "astro:content";
import { docDescription, docTitle } from "./doc-text.ts";
import { docNavItems } from "./docs-nav.ts";
import { type DocVersion, docVersions, releasedVersions } from "./versions.ts";

/**
 * Lists every version of the docs the site serves.
 *
 * @returns The versions: `next` first, then the releases, newest first.
 */
export function allVersions(): DocVersion[] {
  return docVersions(releasedVersions());
}

/**
 * Finds the version `docs/` shows: the latest release, or `next` before the first one.
 *
 * @returns The version.
 */
export function latestVersion(): DocVersion {
  const latest = allVersions().find((version) => version.latest);
  if (latest === undefined) throw new Error("The docs have no version.");
  return latest;
}

/**
 * Reads the docs of one version from its content collection.
 *
 * @param version The version.
 * @returns Its entries.
 */
export function versionEntries(
  version: DocVersion,
): Promise<CollectionEntry<"docs">[]> {
  const suffix = version.next ? "" : `_${version.id.replaceAll(".", "_")}`;
  // A released version's collection is named at build time, so its name is not a literal type.
  return getCollection(`docs${suffix}` as "docs");
}

/** A published docs page. */
export interface DocPage {
  /** The slug under the version's path. */
  readonly slug: string;
  /** The title, from the first heading, Markdown included. */
  readonly title: string;
  /** The first paragraph, about 155 characters. */
  readonly description: string;
}

/**
 * Finds a page's place in the sidebar.
 *
 * @param page The page.
 * @returns Its index, or the sidebar's length for a page the sidebar does not list.
 */
function navOrder(page: DocPage): number {
  const index = docNavItems.findIndex((item) => item.slug === page.slug);
  return index === -1 ? docNavItems.length : index;
}

/**
 * Lists every docs page of a version: the sidebar's pages in its order, then the others.
 *
 * @param version The version.
 * @returns The pages.
 */
export async function docPages(version: DocVersion): Promise<DocPage[]> {
  const entries = await versionEntries(version);
  const pages = entries.map((entry) => {
    const markdown = entry.body ?? "";
    return {
      slug: entry.id,
      title: docTitle(markdown) ?? entry.id,
      description: docDescription(markdown),
    };
  });
  return pages.sort((first, second) => navOrder(first) - navOrder(second));
}
