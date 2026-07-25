import { readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Builds one sidebar item per synced rule guideline, so the sidebar follows
 * the rule set instead of drifting from it.
 *
 * @returns Sidebar items linking each rule id to its guideline page.
 */
function ruleSidebarItems() {
  return readdirSync(resolve(docsRoot, "reference/rules"))
    .filter((entry) => entry.endsWith(".md"))
    .sort()
    .map((entry) => {
      const ruleId = entry.replace(/\.md$/, "");
      return { text: ruleId, link: `/reference/rules/${ruleId}` };
    });
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vibator",
  description:
    "Quality gates for coding agents. Deterministic, actionable checks for the standards linters cannot see.",
  head: [["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }]],
  themeConfig: {
    logo: "/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Guide", link: "/guide/what-is-vibator", activeMatch: "/guide/" },
      { text: "The gate", link: "/gate/", activeMatch: "/gate/" },
      {
        text: "Reference",
        activeMatch: "/reference/",
        items: [
          { text: "Configuration", link: "/reference/configuration" },
          { text: "Rule catalog", link: "/reference/rule-catalog" },
          { text: "Writing rules", link: "/reference/writing-rules" },
          { text: "Gate standards", link: "/gate/standards" },
        ],
      },
    ],

    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "What is Vibator?", link: "/guide/what-is-vibator" },
          { text: "Getting started", link: "/guide/getting-started" },
          { text: "Agent skills", link: "/guide/agent-skills" },
        ],
      },
      {
        text: "The gate",
        items: [
          { text: "What the gate is", link: "/gate/" },
          { text: "Standards", link: "/gate/standards" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Configuration", link: "/reference/configuration" },
          { text: "Rule catalog", link: "/reference/rule-catalog" },
          { text: "Writing rules", link: "/reference/writing-rules" },
          {
            text: "Rule guidelines",
            collapsed: true,
            items: ruleSidebarItems(),
          },
        ],
      },
    ],

    search: { provider: "local" },

    socialLinks: [
      { icon: "github", link: "https://github.com/vibator/vibator" },
    ],

    footer: {
      message: "Released under the MIT License.",
    },
  },
});
