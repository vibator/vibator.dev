/** Base-aware links: every internal link goes through `link`, so the site works under a path. */

/**
 * Joins a base path and a site path.
 *
 * @param base The base, such as `/` or `/vibator`, with or without a trailing slash.
 * @param path The path inside the site, such as `docs/configuration/`, with or without a leading slash.
 * @returns The joined path, such as `/docs/configuration/`.
 */
export function joinBase(base: string, path: string): string {
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}${path.replace(/^\/+/, "")}`;
}

/**
 * Builds the address of a page or file of the site, under the configured base.
 *
 * @param path The path inside the site. Pages end in `/`; files keep their extension.
 * @returns The path from the host's root.
 */
export function link(path = ""): string {
  return joinBase(import.meta.env.BASE_URL, path);
}
