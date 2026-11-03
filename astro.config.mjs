/** The site's build: static pages, the docs collected into `.docs/`, and Sätteri for Markdown. */
import { fileURLToPath } from "node:url";
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import {
  docMarkdownPlugin,
  tableWrapPlugin,
} from "./src/lib/markdown-plugins.ts";

/** The site's root folder, which the collected docs' paths start from. */
const siteRoot = fileURLToPath(new URL("./", import.meta.url));

/** The pages the Starlight site served. Each now lives at `/docs/<slug>/`. */
const moved = [
  "guide/what-is-vibator",
  "guide/getting-started",
  "guide/from-script-to-rule",
  "guide/agent-skills",
  "reference/vibator-namespace",
  "reference/rule-definition",
  "reference/configuration",
  "reference/command-line",
];

export default defineConfig({
  site: "https://vibator.dev",
  trailingSlash: "always",
  build: { format: "directory" },
  devToolbar: { enabled: false },
  redirects: Object.fromEntries(
    moved.map((path) => [`/${path}/`, `/docs/${path.split("/")[1]}/`]),
  ),
  integrations: [
    // The sitemap lists the latest docs only: `next` and older releases point to them.
    sitemap({ filter: (page) => !/\/docs\/(next\/|v\d+\.\d+\/|$)/.test(page) }),
  ],
  markdown: {
    shikiConfig: { theme: "css-variables" },
    processor: satteri({
      // Smart punctuation turns `--` into dashes, which the docs do not use.
      features: { smartPunctuation: false },
      mdastPlugins: [docMarkdownPlugin("/", siteRoot)],
      hastPlugins: [tableWrapPlugin],
    }),
  },
});
