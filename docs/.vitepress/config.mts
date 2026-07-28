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
          { text: "Namespace", link: "/reference/vibator-namespace" },
          { text: "Rule definition", link: "/reference/rule-definition" },
          { text: "Configuration", link: "/reference/configuration" },
          { text: "Command line", link: "/reference/command-line" },
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
