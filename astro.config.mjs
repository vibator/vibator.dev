/** The site's build: static pages, the docs collected into `.docs/`, and Sätteri for Markdown. */
import { fileURLToPath } from "node:url";
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
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
  // Astro serves the fonts from the installed packages, preloads them, and sizes the fallback
  // fonts to match. `optional` keeps the fallback for the page view when a font arrives late, so
  // the text never moves. The site is in English, so only the Latin files ship.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Overpass",
      cssVariable: "--font-overpass",
      display: "optional",
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        variants: [
          {
            src: [
              "@fontsource-variable/overpass/files/overpass-latin-wght-normal.woff2",
            ],
            weight: "100 900",
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      display: "optional",
      fallbacks: ["monospace"],
      options: {
        variants: [400, 600].map((weight) => ({
          src: [
            `@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${weight}-normal.woff2`,
          ],
          weight,
          style: "normal",
        })),
      },
    },
  ],
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
