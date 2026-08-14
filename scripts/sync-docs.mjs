/**
 * Imports reference documentation from the installed vibator and gate packages
 * into this site, so the site never carries its own copy of the source of
 * truth.
 *
 * Run with `npm run docs:sync`. It also runs before `docs:dev` and
 * `docs:build`. The imported pages are not committed.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vibatorRoot = resolve(siteRoot, "node_modules/vibator");

/**
 * Absolute path of an installed gate package.
 *
 * @param {string} name Package name after the `@vibator/` scope.
 * @returns {string} Absolute path of the package root.
 */
function gatePackage(name) {
  return resolve(siteRoot, "node_modules/@vibator", name);
}

/**
 * Maps design documents onto reference pages of the same name. The names are
 * kept so the relative links between the documents keep resolving.
 *
 * @param {string[]} names Design document names, without the extension.
 * @returns {Array<[string, string]>} Pairs of source and target.
 */
function designDocs(names) {
  return names.map((name) => [
    `docs/design/${name}.md`,
    `docs/reference/${name}.md`,
  ]);
}

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
 * @throws {Error} When the package is not installed.
 */
function importRepo(repoRoot, repoName, mappings) {
  if (!existsSync(repoRoot)) {
    throw new Error(
      `[sync-docs] ${repoName} not found at ${repoRoot}; run \`npm install\` first.`,
    );
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

/** The rules `@vibator/recommended` registers, one design document each. */
const recommendedRules = [
  "banned-patterns",
  "codegen-drift",
  "env-example-sync",
  "locale-parity",
  "meaningful-names",
  "no-conflict-markers",
  "no-dead-doc-links",
  "no-deprecated-apis",
  "prefer-array-methods",
  "tsdoc-coverage",
];

importRepo(
  vibatorRoot,
  "vibator",
  designDocs([
    "vibator-namespace",
    "rule-definition",
    "configuration",
    "command-line",
  ]),
);

importRepo(gatePackage("gate"), "@vibator/gate", designDocs(["gate-package"]));

importRepo(
  gatePackage("biome"),
  "@vibator/biome",
  designDocs(["biome-namespace", "biome-rule"]),
);

importRepo(
  gatePackage("knip"),
  "@vibator/knip",
  designDocs(["knip-namespace", "knip-rule"]),
);

importRepo(
  gatePackage("depcruise"),
  "@vibator/depcruise",
  designDocs(["depcruise-namespace", "depcruise-rule"]),
);

importRepo(
  gatePackage("recommended"),
  "@vibator/recommended",
  designDocs([
    "recommended-namespace",
    ...recommendedRules.map((rule) => `${rule}-rule`),
  ]),
);
