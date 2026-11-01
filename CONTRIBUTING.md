# Contributing to vibator.dev

Thanks for contributing. This document is for humans. Agents working in this
repository also follow [AGENTS.md](./AGENTS.md). Participation is governed by the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Setup

```sh
bun install
bun run verify    # everything CI runs
```

`verify` runs these steps:

| Step                 | Tool                         | Checks                                                       |
| -------------------- | ---------------------------- | ------------------------------------------------------------ |
| `bun run lint`       | Biome (strict, `biome.json`) | Formatting and lint rules of the code                        |
| `bun run docs:check` | remark (`.remarkrc.mjs`)     | Markdown links                                               |
| `bun run knip`       | knip                         | Dead code, unused exports and dependencies                   |
| `bun run test`       | bun test                     | The tests of the `.vibator/` rules                           |
| `bun run build`      | Astro, Pagefind              | The site compiles                                            |
| `bun run rules`      | vibator (`.vibator/`)        | Links and anchors, accessibility, Markdown format and access |

Requirements: Bun (version in `.tool-versions`), and Node 24 or later for
Astro. `bun run rules` needs Chromium for Playwright:
`bunx playwright install chromium`.

## Working on the site

| Script            | What it does                                                              |
| ----------------- | ------------------------------------------------------------------------- |
| `bun run dev`     | Local dev server with hot reload. Collects the docs first.                |
| `bun run build`   | Production build into `dist/`, with search.                               |
| `bun run preview` | Serves the last production build locally, as GitHub Pages would serve it. |
| `bun run collect` | Reads the docs of each version from the vibator repository into `.docs/`. |

## Editing content

The landing page (`src/pages/index.astro` and `src/components/home/`) belongs to
this repository.

The docs belong to the vibator repository, in `docs/guide/` and `docs/design/`.
Edit them there. With a checkout at `../vibator`, or at `$VIBATOR_SOURCE`,
`bun run dev` shows your edits under `next` before you commit them.

## Git hooks

`bun install` installs the hooks (husky):

- **pre-commit**: Biome on the staged files, and the remark check.
- **commit-msg**: commitlint enforces Conventional Commits.
- **pre-push**: the full `bun run verify`, including the site build.

## Commits

Conventional Commits, enforced locally and in CI.

## Style

Documentation and prose use plain, direct language. The full guidance is in
[AGENTS.md](./AGENTS.md).

## Pull requests

Keep them scoped to one change. Fill in the template, including the local
verification checklist.

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages. Pull
requests get a preview deployment under `pr-preview/`.
