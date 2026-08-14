# vibator.dev

The vibator.dev website, built with VitePress. It documents vibator, the
unopinionated linter for JavaScript and TypeScript.

Pages under `docs/reference/` are synced by `npm run docs:sync` from the
`docs/design/` folder of the installed packages: `vibator` for the core pages,
and the `@vibator/*` gate packages for the rest. Never edit them here; edit the
design doc in the source repository, release it, and re-run the sync. The
hand-written pages are the landing page (`docs/index.md`) and the guide
(`docs/guide/`).

A synced page keeps its source filename so the relative links between those
documents keep resolving.

The site must build with `npm run docs:build`, which also fails on dead internal
links.

## Layout

```
docs/
  index.md      the landing page.
  guide/        hand-written: what Vibator is, getting started, agent skills,
                and the plugins and presets introduction.
  reference/    synced from the packages' docs/design/. Do not edit here.
  .vitepress/   VitePress config, nav, and sidebar.
scripts/
  sync-docs.mjs imports the reference pages from the installed packages.
```

## Working on it

```sh
npm run docs:sync     # import the reference pages from ../vibator
npm run docs:dev      # local dev server, runs the sync first
npm run docs:build    # production build, fails on dead internal links
npm run verify        # everything CI runs
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
