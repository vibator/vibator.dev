/** The docs, one collection per version, read from `.docs/` (see `scripts/collect.ts`). */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { docSlug, publishedGlobs } from "./lib/doc-paths.ts";
import { releasedVersions } from "./lib/versions.ts";

/**
 * Defines the collection of one version's published docs.
 *
 * @param base The folder holding the version's `docs/` files.
 * @returns The collection.
 */
function docsOf(base: string) {
  return defineCollection({
    loader: glob({
      pattern: [...publishedGlobs],
      base,
      generateId: ({ entry }) => docSlug(entry),
    }),
  });
}

/** Each released version's collection, named after it, such as `docs_v3_0`. */
const released = Object.fromEntries(
  releasedVersions().map((version) => [
    `docs_${version.id.replaceAll(".", "_")}`,
    docsOf(`./.docs/${version.id}`),
  ]),
);

export const collections = {
  docs: docsOf("./.docs/next"),
  ...released,
};
