/** Sätteri plugins for the collected docs: drop the title, rewrite links, wrap tables. */
import { relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  defineHastPlugin,
  defineMdastPlugin,
  type PluginFactoryContext,
} from "satteri";
import { type DocPlace, rewriteDocLink } from "./doc-links.ts";
import { type DocVersion, docVersions, releasedVersions } from "./versions.ts";

/** A collected doc's path from the site root: its version and its path under `docs/`. */
const collectedFile = /^\.docs\/(next|v\d+\.\d+)\/(.+)$/;

/** A collected doc, located in the repository and in the site. */
interface Located {
  /** The doc's path as the repository holds it, such as `docs/guide/02-getting-started.md`. */
  readonly repoPath: string;
  /** Where its links lead. */
  readonly place: DocPlace;
}

/**
 * Locates a file in the collected docs.
 *
 * @param fileUrl The file's address, as the Markdown processor gives it.
 * @param siteRoot The site's root folder.
 * @param versions The versions of the docs.
 * @returns The doc's repository path and place, or `undefined` for a file outside `.docs/`.
 */
function locate(
  fileUrl: URL | undefined,
  siteRoot: string,
  versions: readonly DocVersion[],
): Located | undefined {
  if (fileUrl === undefined) return undefined;
  const fromSite = relative(siteRoot, fileURLToPath(fileUrl))
    .split(sep)
    .join("/");
  const match = collectedFile.exec(fromSite);
  const version = versions.find((each) => each.id === match?.[1]);
  if (match === null || version === undefined) return undefined;
  return {
    repoPath: `docs/${match[2]}`,
    place: { docsPath: version.path, ref: version.ref },
  };
}

/**
 * Builds the plugin that removes a doc's `# ` title, which the layout renders, and rewrites its
 * relative links. Files outside `.docs/` are left alone.
 *
 * @param base The site's base path, such as `/`.
 * @param siteRoot The site's root folder.
 * @returns A plugin factory, called once per Markdown file.
 */
export function docMarkdownPlugin(base: string, siteRoot: string) {
  const versions = docVersions(releasedVersions());
  return (context: PluginFactoryContext) => {
    const doc = locate(context.fileURL, siteRoot, versions);
    if (doc === undefined) return null;
    let titleRemoved = false;
    /**
     * Rewrites one address of the doc.
     *
     * @param url The address as written.
     * @returns The rewritten address.
     */
    const rewrite = (url: string) =>
      rewriteDocLink(url, doc.repoPath, base, doc.place);
    return defineMdastPlugin({
      name: "vibator-doc",
      heading(node, ctx) {
        if (node.depth !== 1 || titleRemoved) return;
        titleRemoved = true;
        ctx.removeNode(node);
      },
      link(node, ctx) {
        ctx.setProperty(node, "url", rewrite(node.url));
      },
      definition(node, ctx) {
        ctx.setProperty(node, "url", rewrite(node.url));
      },
    });
  };
}

/** Wraps each table in a `div.table-wrap`, which scrolls sideways on a narrow screen. */
export const tableWrapPlugin = defineHastPlugin({
  name: "table-wrap",
  element: {
    filter: ["table"],
    visit(node, ctx) {
      ctx.wrapNode(node, {
        type: "element",
        tagName: "div",
        properties: { className: ["table-wrap"] },
        children: [],
      });
    },
  },
});
