# vibator.dev

The vibator.dev website, built with Astro. It documents vibator, a small
framework for project rules over JavaScript and TypeScript projects.

The docs are not in this repository. They live in the vibator repository, in
`docs/guide/` and `docs/design/`. `bun run collect` reads them into `.docs/`,
which git ignores. Edit a doc in the vibator repository, never here.

## Where the docs come from

- The source is `$VIBATOR_SOURCE`, else `../vibator` next to this site, else a
  bare clone in `.sources/vibator.git`.
- `next` is the `docs/` folder of a local checkout as it is on disk, so
  uncommitted edits show up. With the clone, `next` is `main`.
- Each release tag from `v3.0.0` on is a version. The site keeps the latest
  patch of each minor. Earlier releases are not published.
- The latest release is at `/docs/<slug>/`, an older one at
  `/docs/vX.Y/<slug>/`, and `next` at `/docs/next/<slug>/`. Before the first
  release, `next` is at `/docs/<slug>/`.
- The sidebar order and labels are in `src/lib/docs-nav.ts`.
- A relative link between docs becomes a link to that page in the same version.
  A link to another repository file goes to GitHub at the version's tag.

## Layout

```
astro.config.mjs   the build: Sätteri Markdown, the doc plugins, redirects.
scripts/
  collect.ts       reads the docs of each version into .docs/.
  search-index.ts  builds one Pagefind index per version after the build.
.vibator/          the vibator rules this site runs on itself, after the build.
  lib/site.ts      the `site` namespace: the pages of dist/ and an axe-core run.
  links-resolve.ts every internal link and anchor of dist/ resolves.
  pages-accessible.ts  every page passes axe-core for WCAG 2.2 A and AA.
  markdown-*.ts    Markdown matches the remark format and is accessible.
src/
  pages/
    index.astro    the landing page.
    docs/          the docs routes, per version.
  components/
    home/          the landing page sections.
    site-header.astro, site-footer.astro, theme-toggle.astro
    docs-*.astro   the docs sidebar, menu, search, and version menu.
  layouts/         base.astro (every page) and docs.astro (a docs page).
  lib/             versions, doc paths, link rewriting, the sidebar.
  styles/          tokens.css (colors and fonts), site.css, prose.css.
public/            favicon.svg and CNAME, served as is.
design/icons/      the icon candidates.
```

## Working on it

```sh
bun run collect   # read the docs into .docs/
bun run dev       # local dev server, collects first
bun run build     # production build into dist/, with search
bun run rules     # run the .vibator/ rules on the build
bun run test      # the rule tests
bun run docs:format  # format the Markdown with remark
bun run preview   # serve the last build from dist/
bun run verify    # everything CI runs
```

## Writing

Documentation, comments, commit messages, and user-facing strings use direct
language.

- Write plain declarative sentences. State the fact, then at most one sentence of
  why.
- No em-dashes. Use commas, colons, parentheses, periods.
- No rambling, aphorisms, or clever turns. No "X is what makes Y"; write the fact
  or "Y because X".
- No idioms or unusual verbs. Name things for what they are. No cute jargon.
- One fact per bullet. Paragraphs of one to three short sentences.
- No marketing phrasing. State what the tool does.
