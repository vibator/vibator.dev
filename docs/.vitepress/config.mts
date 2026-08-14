import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vibator",
  description:
    "An unopinionated linter for JavaScript and TypeScript. Write custom rules for your own standards.",
  head: [["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }]],
  themeConfig: {
    logo: "/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Guide", link: "/guide/what-is-vibator", activeMatch: "/guide/" },
      {
        text: "Reference",
        activeMatch: "/reference/",
        items: [
          {
            text: "Core",
            items: [
              { text: "Namespace", link: "/reference/vibator-namespace" },
              { text: "Rule definition", link: "/reference/rule-definition" },
              { text: "Configuration", link: "/reference/configuration" },
              { text: "Command line", link: "/reference/command-line" },
            ],
          },
          {
            text: "Plugins",
            items: [
              {
                text: "Introduction",
                link: "/guide/plugins-and-presets",
              },
              { text: "@vibator/biome", link: "/reference/biome-rule" },
              { text: "@vibator/knip", link: "/reference/knip-rule" },
              { text: "@vibator/depcruise", link: "/reference/depcruise-rule" },
              {
                text: "@vibator/recommended",
                link: "/reference/recommended-namespace",
              },
              { text: "@vibator/gate", link: "/reference/gate-package" },
            ],
          },
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
        text: "Reference",
        items: [
          { text: "Namespace", link: "/reference/vibator-namespace" },
          { text: "Rule definition", link: "/reference/rule-definition" },
          { text: "Configuration", link: "/reference/configuration" },
          { text: "Command line", link: "/reference/command-line" },
        ],
      },
      {
        text: "Plugins",
        items: [
          {
            text: "Introduction",
            link: "/guide/plugins-and-presets",
          },
          {
            text: "@vibator/biome",
            collapsed: true,
            items: [
              { text: "The biome rule", link: "/reference/biome-rule" },
              { text: "Namespace", link: "/reference/biome-namespace" },
            ],
          },
          {
            text: "@vibator/knip",
            collapsed: true,
            items: [
              { text: "The knip rule", link: "/reference/knip-rule" },
              { text: "Namespace", link: "/reference/knip-namespace" },
            ],
          },
          {
            text: "@vibator/depcruise",
            collapsed: true,
            items: [
              {
                text: "The depcruise rule",
                link: "/reference/depcruise-rule",
              },
              { text: "Namespace", link: "/reference/depcruise-namespace" },
            ],
          },
          {
            text: "@vibator/recommended",
            collapsed: true,
            items: [
              { text: "Namespace", link: "/reference/recommended-namespace" },
              {
                text: "banned-patterns",
                link: "/reference/banned-patterns-rule",
              },
              {
                text: "codegen-drift",
                link: "/reference/codegen-drift-rule",
              },
              {
                text: "env-example-sync",
                link: "/reference/env-example-sync-rule",
              },
              {
                text: "locale-parity",
                link: "/reference/locale-parity-rule",
              },
              {
                text: "meaningful-names",
                link: "/reference/meaningful-names-rule",
              },
              {
                text: "no-conflict-markers",
                link: "/reference/no-conflict-markers-rule",
              },
              {
                text: "no-dead-doc-links",
                link: "/reference/no-dead-doc-links-rule",
              },
              {
                text: "no-deprecated-apis",
                link: "/reference/no-deprecated-apis-rule",
              },
              {
                text: "prefer-array-methods",
                link: "/reference/prefer-array-methods-rule",
              },
              {
                text: "tsdoc-coverage",
                link: "/reference/tsdoc-coverage-rule",
              },
            ],
          },
          { text: "@vibator/gate", link: "/reference/gate-package" },
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
