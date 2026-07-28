# Contributing to vibator.dev

Thanks for contributing. This document is for humans. Agents working in this
repository also follow [AGENTS.md](./AGENTS.md). Participation is governed by the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Setup

```sh
npm install
npm run verify    # everything CI runs: lint, knip, docs:build
```

`verify` runs the whole gate:

| Step                 | Tool                         | Checks                                          |
|----------------------|------------------------------|-------------------------------------------------|
| `npm run lint`       | Biome (strict, `biome.json`) | Formatting, lint rules                          |
| `npm run knip`       | knip                         | Dead code, unused exports and dependencies      |
| `npm run docs:build` | VitePress                    | The site compiles; dead internal links fail it  |

Requirements: Node 24 or later (see `.nvmrc`).

## Working on the site

| Script                 | What it does                                                              |
|------------------------|---------------------------------------------------------------------------|
| `npm run docs:dev`     | Local dev server with hot reload. Runs the sync first.                    |
| `npm run docs:build`   | Production build into `docs/.vitepress/dist`. Runs the sync first.        |
| `npm run docs:preview` | Serves the last production build locally, as GitHub Pages would serve it. |
| `npm run docs:sync`    | Imports the reference pages from the sibling `vibator` checkout.          |

## Editing content

The landing page (`docs/index.md`) and the guide (`docs/guide/`) belong to this
repository.

Pages under `docs/reference/` are synced from `vibator/docs/design/` by
`npm run docs:sync`. Edit the design doc in the source repository and run the
sync, not the copy here.

## Git hooks

`npm install` installs the hooks (husky):

- **pre-commit**: Biome on the staged files.
- **commit-msg**: commitlint enforces Conventional Commits.
- **pre-push**: the full `npm run verify`, including the site build.

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
