# Contributing to vibator.dev

Thanks for contributing. This document is for humans; agents working in this
repository additionally follow [AGENTS.md](./AGENTS.md).

Participation is governed by the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Setup

Requirements: Node 22 or later (see `.nvmrc`).

```sh
npm install
npm run verify
```

`verify` runs the whole gate:

| Step                 | Tool                         | Checks                                         |
|----------------------|------------------------------|------------------------------------------------|
| `npm run lint`       | Biome (strict, `biome.json`) | Formatting, lint rules, complexity limits      |
| `npm run knip`       | knip                         | Dead code, unused exports and dependencies     |
| `npm run vibator`    | vibator                      | Conflict markers, file sizes, dead doc links   |
| `npm run docs:build` | VitePress                    | The site compiles; dead internal links fail it |

## Working on the site

| Script                 | What it does                                                              |
|------------------------|---------------------------------------------------------------------------|
| `npm run docs:dev`     | Local dev server with hot reload. Runs the sync first.                    |
| `npm run docs:build`   | Production build into `docs/.vitepress/dist`. Runs the sync first.        |
| `npm run docs:preview` | Serves the last production build locally, as GitHub Pages would serve it. |
| `npm run docs:sync`    | Imports the reference pages from the sibling checkouts (see below).       |

## Editing content

Pages under `docs/guide/` and the landing page belong to this repository.

Pages under `docs/reference/` and `docs/gate/standards.md` are synced from
the sibling `vibator` and `vibator-gate` by running `npm run docs:sync`;
Edit the source repository and run the sync, instead of the copy here.

## Git hooks

`npm install` installs the hooks (husky):

- **pre-commit**: Biome on staged files, plus vibator's fast rules
  (`--staged --only no-conflict-markers,max-file-size,no-dead-doc-links`)
  on the same scope.
- **commit-msg**: commitlint enforces Conventional Commits.
- **pre-push**: the full `npm run verify`, including the site build.

## Commits

Conventional Commits are enforced locally and in CI.

## Pull requests

Keep them scoped to one change. Fill in the template, including the local
verification checklist.

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages. Pull
requests get a preview deployment under `pr-preview/`.

