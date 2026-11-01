/** The versions of the docs the site serves: `next` and the latest patch of each minor from v3.0 on. */
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/** A released version the site serves, as `scripts/collect.ts` extracted it. */
export interface ReleasedVersion {
  /** Its id and path segment, such as `v3.1`. */
  readonly id: string;
  /** The tag its docs come from, such as `v3.1.2`. */
  readonly tag: string;
}

/** A version of the docs, as the pages use it. */
export interface DocVersion {
  /** Its id: `v3.1`, or `next` for `main`. */
  readonly id: string;
  /** What the menu says under its id, such as `Latest release`. */
  readonly note: string;
  /** The site path of its docs, such as `docs/`, `docs/v3.0/` or `docs/next/`. */
  readonly path: string;
  /** The git ref its links to other repository files use: a tag, or `main`. */
  readonly ref: string;
  /** Whether `docs/` shows it. */
  readonly latest: boolean;
  /** Whether it is `next`, the docs of `main`. */
  readonly next: boolean;
}

/** The first major whose docs the site serves. The 1.x and 2.x docs are not published. */
const firstMajor = 3;

/** A release tag, such as `v3.1.2`. */
const releaseTag = /^v(\d+)\.(\d+)\.(\d+)$/;

/** A release tag read into numbers. */
interface Release {
  /** The tag, such as `v3.1.2`. */
  readonly tag: string;
  /** Its minor's id, such as `v3.1`. */
  readonly id: string;
  /** Its major, minor and patch. */
  readonly numbers: readonly [number, number, number];
}

/**
 * Reads a tag as a release the site serves docs for.
 *
 * @param tag The tag.
 * @returns The release, or `undefined` for another tag or a release before v3.0.
 */
function releaseOf(tag: string): Release | undefined {
  const match = releaseTag.exec(tag);
  if (!match) return undefined;
  const numbers = match.slice(1).map(Number) as [number, number, number];
  const [major, minor] = numbers;
  return major < firstMajor
    ? undefined
    : { tag, id: `v${major}.${minor}`, numbers };
}

/**
 * Compares releases, newest first.
 *
 * @param first One release.
 * @param second The other.
 * @returns A negative number when the first is newer.
 */
function newestFirst(first: Release, second: Release): number {
  const [a, b] = [first.numbers, second.numbers];
  return b[0] - a[0] || b[1] - a[1] || b[2] - a[2];
}

/**
 * Picks the versions to serve from a list of tags: the latest patch of each minor from v3.0 on.
 *
 * @param tags The repository's tags.
 * @returns The versions, newest first.
 */
export function pickVersions(tags: readonly string[]): ReleasedVersion[] {
  const releases = tags
    .flatMap((tag) => releaseOf(tag) ?? [])
    .sort(newestFirst);
  // Newest first, so the first release of each minor is its latest patch.
  const latest = releases.filter(
    (release, index) =>
      releases.findIndex((other) => other.id === release.id) === index,
  );
  return latest.map(({ id, tag }) => ({ id, tag }));
}

/**
 * The folder `scripts/collect.ts` writes each version's docs to: `.docs/` in the site's folder.
 * It is found from the working directory because Astro bundles this module elsewhere.
 */
const docsDir = pathToFileURL(`${process.cwd()}/.docs/`);

/**
 * Reads the released versions `scripts/collect.ts` extracted.
 *
 * @returns The versions, newest first, or none when the collect step has not run.
 */
export function releasedVersions(): ReleasedVersion[] {
  const list = new URL("versions.json", docsDir);
  if (!existsSync(list)) return [];
  return JSON.parse(readFileSync(list, "utf8")) as ReleasedVersion[];
}

/**
 * Lists every version of the docs in the menu's order: `next`, the latest release, then older
 * ones. Without a release, `next` takes `docs/`.
 *
 * @param released The released versions, newest first.
 * @returns The versions.
 */
export function docVersions(
  released: readonly ReleasedVersion[],
): DocVersion[] {
  const releases = released.map((version, index) => ({
    id: version.id,
    note: index === 0 ? "Latest release" : "Older release",
    path: index === 0 ? "docs/" : `docs/${version.id}/`,
    ref: version.tag,
    latest: index === 0,
    next: false,
  }));
  const next = {
    id: "next",
    note: "Unreleased, on main",
    path: releases.length === 0 ? "docs/" : "docs/next/",
    ref: "main",
    latest: releases.length === 0,
    next: true,
  };
  return [next, ...releases];
}
