# Plugins

Vibator ships no rules of its own. These packages, together called the gate,
are the official plugins and presets: they give you a working set of rules
from day one. Every package is independent, install only the ones you want.

The [quick setup](/guide/getting-started#quick-setup) wires them up for you.

## The packages

| Package                                                    | What it adds                                                                                                        |
|------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| [`@vibator/biome`](/reference/biome-rule)                  | The `biome` rule: formatting and lint findings from [Biome](https://biomejs.dev).                                   |
| [`@vibator/knip`](/reference/knip-rule)                    | The `knip` rule: unused files, exports, and dependencies from [Knip](https://knip.dev).                             |
| [`@vibator/depcruise`](/reference/depcruise-rule)          | The `depcruise` rule: ruleset violations from [dependency-cruiser](https://github.com/sverweij/dependency-cruiser). |
| [`@vibator/recommended`](/reference/recommended-namespace) | The recommended general-purpose rules.                                                                              |
| [`@vibator/gate`](/reference/gate-package)                 | The shared Biome, dependency-cruiser, and TypeScript presets.                                                       |
| `@vibator/create-gate`                                     | The wizard that writes the configuration.                                                                           |

## Why run tools through vibator?

Nothing forces you to, these tools run fine on their own, and you can keep them that way.

Running them through vibator changes three things:

- **One command, one report.** Every finding arrive in a single run
  and a single output, instead of a chain of npm scripts each with its own
  format. The output is [SARIF-compatible](/reference/command-line#reporters),
  so it drops into the code-scanning and CI workflows you already have.
- **One entry point.** `.vibator.json` decides which tools run and at what
  severity. Their options can live inline or stay in the config files you
  already have.
