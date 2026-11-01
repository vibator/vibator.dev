/** Collects the vibator docs into `.docs/`: `next`, and the latest patch of each minor from v3.0 on. */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pickVersions } from "../src/lib/versions.ts";

/** The site's root folder. */
const siteRoot = fileURLToPath(new URL("../", import.meta.url));

/** Where the collected docs go. Git ignores it. */
const docsRoot = join(siteRoot, ".docs");

/** Where the bare clone lives when no local checkout is found. Git ignores it. */
const cloneDir = join(siteRoot, ".sources/vibator.git");

/** The repository to clone. */
const remote = "https://github.com/vibator/vibator.git";

/** A vibator repository the docs are read from. */
interface Source {
  /** The git options that select the repository. */
  readonly git: readonly string[];
  /** The working tree of a local checkout, whose `docs/` becomes `next` as it is on disk. */
  readonly checkout?: string;
  /** What the log names it. */
  readonly label: string;
}

/**
 * Runs a command and returns its output.
 *
 * @param command The command.
 * @param args Its arguments.
 * @param input What to write to its standard input.
 * @returns Its standard output.
 * @throws {Error} When the command fails.
 */
function run(command: string, args: readonly string[], input?: Buffer): Buffer {
  const result = spawnSync(command, args, {
    input,
    maxBuffer: 256 * 1024 * 1024,
  });
  if (result.status !== 0) {
    const detail = result.stderr?.toString().trim() || result.error?.message;
    throw new Error(`${command} ${args.join(" ")} failed: ${detail}`);
  }
  return result.stdout;
}

/**
 * Tells whether a folder is a checkout of a repository with a `docs/` folder.
 *
 * @param folder The folder.
 * @returns `true` for a checkout.
 */
function isCheckout(folder: string): boolean {
  return existsSync(join(folder, ".git")) && existsSync(join(folder, "docs"));
}

/**
 * Finds a local checkout: `$VIBATOR_SOURCE`, else `../vibator` next to the site.
 *
 * @returns The checkout, or `undefined` when neither exists.
 * @throws {Error} When `$VIBATOR_SOURCE` is set but is not a checkout.
 */
function localSource(): Source | undefined {
  const fromEnv = process.env.VIBATOR_SOURCE;
  const folder = resolve(siteRoot, fromEnv || "../vibator");
  if (isCheckout(folder)) {
    return { git: ["-C", folder], checkout: folder, label: folder };
  }
  if (fromEnv)
    throw new Error(
      `VIBATOR_SOURCE=${fromEnv} is not a checkout with a docs/ folder.`,
    );
  return undefined;
}

/**
 * Clones the repository bare into `.sources/`, or fetches its tags and `main` when it exists.
 *
 * @returns The clone.
 */
function cloneSource(): Source {
  if (existsSync(cloneDir)) {
    const refspec = "+refs/heads/main:refs/heads/main";
    run("git", [
      "--git-dir",
      cloneDir,
      "fetch",
      "--tags",
      "--force",
      remote,
      refspec,
    ]);
  } else {
    run("git", ["clone", "--bare", remote, cloneDir]);
  }
  return { git: ["--git-dir", cloneDir], label: remote };
}

/**
 * Extracts the `docs/` folder of a git ref into a folder, without the `docs/` prefix.
 *
 * @param source The repository.
 * @param ref The tag or branch.
 * @param folder The folder, emptied first.
 */
function extract(source: Source, ref: string, folder: string): void {
  rmSync(folder, { recursive: true, force: true });
  mkdirSync(folder, { recursive: true });
  const archive = run("git", [
    ...source.git,
    "archive",
    "--format=tar",
    ref,
    "docs",
  ]);
  run("tar", ["-x", "--strip-components=1", "-C", folder], archive);
}

/**
 * Collects `next`: the working tree's `docs/` of a local checkout, or `main` of the clone.
 *
 * @param source The repository.
 */
function collectNext(source: Source): void {
  const folder = join(docsRoot, "next");
  if (source.checkout === undefined) {
    extract(source, "main", folder);
    return;
  }
  rmSync(folder, { recursive: true, force: true });
  cpSync(join(source.checkout, "docs"), folder, { recursive: true });
}

const source = localSource() ?? cloneSource();
const tags = run("git", [...source.git, "tag", "--list", "v*"])
  .toString()
  .split("\n");
const versions = pickVersions(tags.filter(Boolean));
rmSync(docsRoot, { recursive: true, force: true });
mkdirSync(docsRoot, { recursive: true });
collectNext(source);
for (const version of versions) {
  extract(source, version.tag, join(docsRoot, version.id));
}
writeFileSync(
  join(docsRoot, "versions.json"),
  `${JSON.stringify(versions, null, 2)}\n`,
);
const names = versions.map((version) => `${version.id} (${version.tag})`);
console.log(`[collect] read the docs from ${source.label}`);
console.log(
  `[collect] versions: next${names.length > 0 ? `, ${names.join(", ")}` : ""}`,
);
