/** The code and the output the landing page shows, taken from real runs of these rules. */

/** The rule in the hero, as `docs/guide/02-getting-started.md` writes it. */
export const colorsRule = `import { defineRule, vibator } from "vibator";

export default defineRule({
  id: "colors-from-tokens",
  title: "CSS colors come from tokens.css",
  check: () =>
    vibator.text
      .search(
        vibator.project.files.match(["src/**/*.css", "!src/styles/tokens.css"]),
        /#[0-9a-f]{3,8}\\b/i,
      )
      .map((hit) => ({
        ...hit,
        message: \`Hardcoded color \${hit.text}\`,
        fix: "Use a variable from tokens.css",
      })),
});`;

/** One finding as `npx vibator --reporter json` prints it, without the snippet. */
export const jsonFinding = `{
  "ruleId": "env-example",
  "severity": "error",
  "file": "src/config.ts",
  "line": 2,
  "column": 20,
  "message": "API_KEY is read but not in .env.example",
  "expected": "Every variable the code reads has an entry in .env.example",
  "fix": "Add API_KEY= to .env.example"
}`;

/** A test of the hero's rule with `vibator/testing`, as the getting started guide writes it. */
export const ruleTest = `import { expect, it } from "vitest";
import { runRule } from "vibator/testing";
import rule from "../.vibator/colors-from-tokens.ts";

it("flags a hardcoded color", async () => {
  const findings = await runRule(rule, {
    files: { "src/card.css": "a { color: #fff; }" },
  });
  expect(findings.map((finding) => finding.message)).toEqual([
    "Hardcoded color #fff",
  ]);
});`;

/** The scoped runs, as a pre-commit hook and a pull request job would call them. */
export const scopeSample = `npx vibator --staged         # files staged for commit
npx vibator --changed        # uncommitted changes
npx vibator --since main     # changes since a ref`;

/** A \`.vibator.json\` that sets a severity per rule. */
export const configSample = `{
  "rules": {
    "env-example": "error",
    "colors-from-tokens": "warn",
    "no-conflict-markers": "off"
  }
}`;

/** The namespace module of a plugin, as \`docs/guide/04-plugins.md\` writes it, without the type declaration. */
export const pluginModule = `import { defineNamespace, vibator } from "vibator";

export const i18n = defineNamespace("i18n", {
  file(locale: string) {
    return vibator.project.files.get(
      \`\${vibator.project.root}/locales/\${locale}.json\`,
    );
  },
  keys(locale: string): string[] {
    return vibator.json.keys(vibator.json.parse(i18n.file(locale)));
  },
});`;

/** A \`.vibator.json\` that loads a plugin. */
export const pluginSample = `{
  "plugins": ["@acme/vibator-i18n"]
}`;

/** A base config, published in a package. */
export const baseConfigSample = `{
  "plugins": ["@acme/vibator-i18n"],
  "rules": { "locales-match": "error" }
}`;

/** A project config that extends the base and overrides one severity. */
export const extendsSample = `{
  "extends": ["@acme/vibator-config/vibator.json"],
  "rules": { "locales-match": "warn" }
}`;
