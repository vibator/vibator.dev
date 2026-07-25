# vibator.dev

The vibator.dev website, built with VitePress. Pages under
`docs/reference/` and `docs/gate/standards.md` are synced from the sibling
`vibator` and `vibator-gate` checkouts by `npm run docs:sync`; never edit
them here, edit the source repository and re-run the sync. The site must
build with `npm run docs:build`, which also fails on dead internal links.

## Vibator

This repository is gated by @vibator/gate. Run the whole gate with
`npm run verify`. Fix findings at the source; never weaken
a gate to make it pass. The standards and the override recipes live in
`node_modules/@vibator/gate/docs/standards.md`; the thin configs in
this repository state only what differs. For machine-readable findings
run `npx vibator --reporter json`.

### Agent skills

These packages bundle agent skills (a folder with a SKILL.md, following
the Agent Skills format). They are not installed automatically; install
the ones your agent should use.
- `using-the-vibator-gate` (ships in `node_modules/@vibator/gate/skills/`):
  how to run the gate, act on findings, and adjust standards through the
  thin local configs. Install it by copying the folder into your agent's
  skills directory.
- `configuring-vibator`: set up or tune vibator.json from what the
  project contains.
- `fixing-vibator-findings`: fix findings at the source instead of
  weakening the gate.
- `writing-vibator-rules`: write custom rules for standards the built-in
  ones do not cover.
  These three ship with vibator: list them with `npx vibator skills` and
  install them with `npx vibator skills --install`.
