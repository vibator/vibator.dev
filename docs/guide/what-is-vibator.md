# What is Vibator?

Vibator is an unopinionated linter for JavaScript and TypeScript. It ships no
rules of its own. You write custom rules for your own standards, and Vibator
runs them across the project, reports each finding with the guideline that
explains it, and fixes them on request.

## The problem it solves

Vibator started as a way to hold coding agents to a project's standards. Style
guidance written in prompts and guides is not actionable: an agent drifts from
it as its context grows. Left alone, an agent checks these standards with
throwaway scripts.

Vibator gives you a framework to encode a standard as a deterministic check with
a guideline attached. When the check fails, the standard reaches the agent, and
it fixes the problem at its source.

## How it works

- A rule reads the project through the `vibator` namespace and returns findings.
  The namespace covers files, git, the shell, and more, so a rule does not need
  to reach for them directly.
- The engine loop is thin: `check → write → recheck → report`. The only thing
  the framework imposes is the severity of a finding (`error`, `warn`, or
  `off`).
- A rule sees every file at once, so it can make cross-file findings, not just
  judge one file in isolation.
- You decide how a rule reads the project, whether it takes options, and whether
  it is fixable. You control the shape of its diagnostics.
- Output is a readable terminal report, JSON, or SARIF for code scanning.

## Alongside other tools

Vibator runs next to your other linters, and it can also run them. The
[gate](/guide/plugins-and-presets) drives Biome, Knip, and dependency-cruiser
through their JavaScript APIs and reports their findings as vibator
diagnostics.
