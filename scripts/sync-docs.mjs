/**
 * Imports reference documentation from the sibling vibator and vibator-gate
 * checkouts into this site, so the site never carries its own copy of the
 * source of truth.
 *
 * Run with `npm run docs:sync`. It also runs before `docs:dev` and
 * `docs:build`. When a sibling checkout is missing, the previously synced
 * files are kept and a warning is printed, so the site still builds from a
 * standalone clone.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vibatorRoot = resolve(siteRoot, "../vibator");
const gateRoot = resolve(siteRoot, "../vibator-gate");

/**
 * Copies one Markdown file into the site with a header naming its source.
 *
 * @param {string} sourcePath Absolute path of the file to import.
 * @param {string} targetPath Absolute path inside the site to write.
 * @param {string} sourceLabel Repository-relative label for the header.
 */
function importDoc(sourcePath, targetPath, sourceLabel) {
  const header = `<!-- Synced from ${sourceLabel}. Do not edit here; edit the source and run \`npm run docs:sync\`. -->\n\n`;
  const body = readFileSync(sourcePath, "utf8");
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, header + body);
}

/**
 * Imports every mapped document from one repository, if it is checked out.
 *
 * @param {string} repoRoot Absolute path of the sibling repository.
 * @param {string} repoName Name used in headers and warnings.
 * @param {Array<[string, string]>} mappings Pairs of repo-relative source and site-relative target.
 */
function importRepo(repoRoot, repoName, mappings) {
  if (!existsSync(repoRoot)) {
    console.warn(
      `[sync-docs] ${repoName} not found at ${repoRoot}; keeping previously synced files.`,
    );
    return;
  }
  for (const [source, target] of mappings) {
    importDoc(
      join(repoRoot, source),
      join(siteRoot, target),
      `${repoName}/${source}`,
    );
  }
  console.log(`[sync-docs] imported ${mappings.length} files from ${repoName}`);
}

const vibatorMappings = [
  ["docs/configuration.md", "docs/reference/configuration.md"],
  ["docs/rule-catalog.md", "docs/reference/rule-catalog.md"],
  ["docs/writing-rules.md", "docs/reference/writing-rules.md"],
];

if (existsSync(join(vibatorRoot, "docs/rules"))) {
  for (const entry of readdirSync(join(vibatorRoot, "docs/rules"))) {
    if (entry.endsWith(".md")) {
      vibatorMappings.push([
        `docs/rules/${entry}`,
        `docs/reference/rules/${entry}`,
      ]);
    }
  }
}

importRepo(vibatorRoot, "vibator", vibatorMappings);
importRepo(gateRoot, "vibator-gate", [
  ["packages/gate/docs/standards.md", "docs/gate/standards.md"],
]);
