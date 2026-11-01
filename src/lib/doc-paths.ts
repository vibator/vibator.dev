/** Where each published Markdown file of the vibator repository lives on the site. */

/** The folders under `docs/` the site publishes, as content collection globs. */
export const publishedGlobs = ["guide/*.md", "design/*.md"] as const;

/** A published doc's path from the repository root, such as `docs/guide/02-getting-started.md`. */
const publishedPath = /^docs\/(?:guide|design)\/[^/]+\.md$/i;

/**
 * Turns a doc's file name into its slug: no folder, no number prefix, no extension.
 *
 * @param fileName The file name, such as `guide/02-getting-started.md`.
 * @returns The slug, such as `getting-started`.
 */
export function docSlug(fileName: string): string {
  return fileName
    .replace(/^.*\//, "")
    .replace(/\.md$/i, "")
    .replace(/^\d+-/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

/**
 * Finds the site slug a repository file is published at.
 *
 * @param repoPath A path from the repository root, such as `docs/design/configuration.md`.
 * @returns The slug, or `undefined` when the site does not publish that file.
 */
export function publishedSlug(repoPath: string): string | undefined {
  return publishedPath.test(repoPath) ? docSlug(repoPath) : undefined;
}

/**
 * Applies one segment of a relative path to a list of directories.
 *
 * @param parts The directories so far, or `undefined` once the path climbed above the root.
 * @param segment The segment: `..`, `.`, empty, or a name.
 * @returns The directories after the segment.
 */
function step(
  parts: string[] | undefined,
  segment: string,
): string[] | undefined {
  if (parts === undefined) return undefined;
  if (segment === "..")
    return parts.length === 0 ? undefined : parts.slice(0, -1);
  return segment === "." || segment === "" ? parts : [...parts, segment];
}

/**
 * Resolves a relative path against a directory, POSIX style, inside the repository.
 *
 * @param directory The directory, from the repository root (`docs/guide`, or `` for the root).
 * @param relative The relative path, such as `../design/configuration.md`.
 * @returns The path from the repository root, or `undefined` when it climbs above the root.
 */
export function resolveRepoPath(
  directory: string,
  relative: string,
): string | undefined {
  const start = directory === "" ? [] : directory.split("/");
  const parts = relative.split("/").reduce<string[] | undefined>(step, start);
  if (parts === undefined) return undefined;
  const trailing = relative.endsWith("/") && parts.length > 0 ? "/" : "";
  return parts.join("/") + trailing;
}

/**
 * Finds the directory of a repository path.
 *
 * @param repoPath A file's path from the repository root.
 * @returns Its directory, or `` for a file at the root.
 */
export function directoryOf(repoPath: string): string {
  const index = repoPath.lastIndexOf("/");
  return index === -1 ? "" : repoPath.slice(0, index);
}
