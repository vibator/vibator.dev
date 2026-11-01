/** The `site` namespace: the built site in `dist/`, its pages, and an axe-core run over them. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { extname, join, relative } from "node:path";
import axe from "axe-core";
import { type Browser, chromium, type Page } from "playwright";
import { defineNamespace, vibator } from "vibator";

/** The color schemes the site follows. */
const schemes = ["light", "dark"] as const;

/** The viewports the pages are checked at. */
const viewports = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "phone", width: 390, height: 844 },
] as const;

/** The axe tags of WCAG 2.0, 2.1, and 2.2 at levels A and AA. */
const tags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22a",
  "wcag22aa",
];

/** The content types the server sends, by extension. */
const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
};

/** One way to look at a page: its scheme and its viewport. */
interface View {
  /** The color scheme. */
  readonly scheme: (typeof schemes)[number];
  /** The viewport. */
  readonly viewport: (typeof viewports)[number];
}

/** One axe violation on one element. */
interface Violation {
  /** The page's absolute path in `dist/`. */
  readonly page: string;
  /** Where it was seen, such as `light, phone, search open`. */
  readonly state: string;
  /** The axe rule id. */
  readonly rule: string;
  /** The element's selector. */
  readonly target: string;
  /** What axe says is wrong. */
  readonly message: string;
}

declare global {
  interface Window {
    /** axe-core, injected into each page. */
    axe: typeof axe;
  }
}

/**
 * Lists the files of a folder, recursively.
 *
 * @param folder - The folder's absolute path.
 * @returns The files' absolute paths.
 */
function filesOf(folder: string): string[] {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    return entry.isDirectory() ? filesOf(path) : [path];
  });
}

/**
 * The file a request path names in a folder.
 *
 * @param folder - The served folder.
 * @param pathname - The request path.
 * @returns The file's absolute path, which may not exist.
 */
function fileFor(folder: string, pathname: string): string {
  const path = join(folder, decodeURIComponent(pathname));
  return vibator.project.exists(path) && statSync(path).isDirectory()
    ? join(path, "index.html")
    : path;
}

/**
 * Serves a folder on a free local port.
 *
 * @param folder - The folder to serve.
 * @returns The listening server and its origin.
 */
async function serve(
  folder: string,
): Promise<{ server: Server; origin: string }> {
  const server = createServer((request, response) => {
    const file = fileFor(
      folder,
      new URL(request.url ?? "/", "http://h").pathname,
    );
    if (!vibator.project.exists(file)) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, {
      "content-type": contentTypes[extname(file)] ?? "application/octet-stream",
    });
    response.end(readFileSync(file));
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  return { server, origin: `http://127.0.0.1:${port}` };
}

/**
 * Runs axe on a page.
 *
 * @param page - The open page.
 * @returns Each violation's rule, target, and message.
 */
async function axeOn(
  page: Page,
): Promise<Pick<Violation, "rule" | "target" | "message">[]> {
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(
    (values) =>
      window.axe
        .run(document, { runOnly: { type: "tag", values } })
        .then((result) =>
          result.violations.flatMap((rule) =>
            rule.nodes.map((node) => ({
              rule: rule.id,
              target: node.target.join(" "),
              message: [...node.any, ...node.all][0]?.message ?? rule.help,
            })),
          ),
        ),
    tags,
  );
}

/**
 * Opens what a page can open, the search dialog and the docs menu, and runs axe in each state.
 *
 * @param page - The page, already checked as it loads.
 * @param label - The view, such as `light, desktop`.
 * @returns The violations of each state, with the state named.
 */
async function openStates(
  page: Page,
  label: string,
): Promise<Omit<Violation, "page">[]> {
  const found: Omit<Violation, "page">[] = [];
  const search = page.locator("pagefind-modal-trigger button");
  if (await search.isVisible()) {
    await search.click();
    await page.locator("pagefind-modal input").fill("rule");
    await page.waitForTimeout(500);
    const state = `${label}, search open`;
    found.push(...(await axeOn(page)).map((v) => ({ ...v, state })));
    await page.keyboard.press("Escape");
  }
  const menu = page.locator("[data-menu-open]");
  if (await menu.isVisible()) {
    await menu.click();
    const state = `${label}, menu open`;
    found.push(...(await axeOn(page)).map((v) => ({ ...v, state })));
  }
  return found;
}

/**
 * Checks one page in one view, as it loads and with each open state.
 *
 * @param browser - The browser.
 * @param url - The page's address.
 * @param view - The scheme and the viewport.
 * @returns The violations, without the page.
 */
async function checkView(
  browser: Browser,
  url: string,
  view: View,
): Promise<Omit<Violation, "page">[]> {
  const context = await browser.newContext({
    colorScheme: view.scheme,
    reducedMotion: "reduce",
    viewport: view.viewport,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const label = `${view.scheme}, ${view.viewport.name}`;
  const found = [
    ...(await axeOn(page)).map((v) => ({ ...v, state: label })),
    ...(await openStates(page, label)),
  ];
  await context.close();
  return found;
}

/**
 * Checks pages in every view.
 *
 * @param browser - The browser.
 * @param origin - The local server's origin.
 * @param pages - The pages' absolute paths.
 * @returns The violations.
 */
async function checkPages(
  browser: Browser,
  origin: string,
  pages: readonly string[],
): Promise<Violation[]> {
  const found: Violation[] = [];
  for (const page of pages) {
    const url = `${origin}${site.servedPath(page)}`;
    for (const scheme of schemes) {
      for (const viewport of viewports) {
        const seen = await checkView(browser, url, { scheme, viewport });
        found.push(...seen.map((v) => ({ ...v, page })));
      }
    }
  }
  return found;
}

const site = defineNamespace("site", {
  /**
   * The built site's folder.
   *
   * @returns Its absolute path.
   */
  dist(): string {
    return join(vibator.project.root, "dist");
  },

  /**
   * Lists the files of the built site, without the search index.
   *
   * @returns Their absolute paths, or none before a build.
   */
  files(): string[] {
    if (!vibator.project.exists(site.dist())) return [];
    return filesOf(site.dist()).filter(
      (path) => !relative(site.dist(), path).startsWith("pagefind/"),
    );
  },

  /**
   * Lists the HTML pages of the built site, without the redirect pages.
   *
   * @returns Their absolute paths.
   */
  pages(): string[] {
    return site
      .files()
      .filter((path) => path.endsWith(".html"))
      .filter(
        (path) =>
          !vibator.project.files
            .get(path)
            .content.includes('http-equiv="refresh"'),
      );
  },

  /**
   * The address path a file of the built site is served at.
   *
   * @param path - The file's absolute path.
   * @returns Its path from the host's root, such as `/docs/getting-started/`.
   */
  servedPath(path: string): string {
    return `/${relative(site.dist(), path).replace(/(^|\/)index\.html$/, "$1")}`;
  },

  /**
   * Runs axe-core on pages of the built site, in light and dark, at desktop and phone width, with
   * the search dialog and the docs menu open. Needs Playwright's Chromium.
   *
   * @param pages - The pages' absolute paths.
   * @returns Every violation.
   */
  async audit(pages: readonly string[]): Promise<Violation[]> {
    const { server, origin } = await serve(site.dist());
    const browser = await chromium.launch();
    try {
      return await checkPages(browser, origin, pages);
    } finally {
      await browser.close();
      server.close();
    }
  },
});

declare module "vibator" {
  interface Vibator {
    site: typeof site;
  }
}
