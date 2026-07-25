# What is Vibator?

Vibator is a quality gate framework for coding agents. It runs configurable, glob-scoped rules over your project and reports findings an agent can act on directly. It targets JavaScript and TypeScript projects, though some rules apply to any file their globs select.

## The problem it solves

You tell your agent the standards in a prompt or an `AGENTS.md`: document every function, keep locales in sync, never call deprecated APIs. The agent applies them while its context is fresh and drifts as the context grows. Linters and type checkers catch some of the fallout, but a class of defects sits outside their reach: a translation key added to one locale only, an env var read but never documented, a generated file never regenerated. Left alone, the agent enforces those with throwaway scripts of its own.

Vibator turns those standards into checks that run the same way every time. When one fails, the finding restates the standard, so the agent fixes the problem at its source instead of searching the code for it.

## Three fields per finding

Every finding keeps three fields separate:

- `message`: what is wrong.
- `expected`: the standard, stated positively.
- `fix`: the concrete next action.

You read them as a sentence. A tool runs `vibator --reporter json` and acts on `fix` without parsing prose. The JSON report also carries the code snippet around each finding and an absolute path to every guideline, so a consumer never needs to know where the package manager put the package. The full report format is in the [configuration reference](/reference/configuration#the-json-reporter).

## The guideline arrives with the failure

Every rule ships a Markdown guideline: what the rule is, the failure it prevents, and what is expected. `vibator explain <rule>` prints it, and every finding points at it. You can also map your own documents onto rules, so a finding points the agent at your standards as well as the shipped guideline.

## What it checks

The built-in rules cover the defects common in generated code: committed conflict markers, missing TSDoc, filler names like `data` and `tmp`, calls into deprecated APIs, locales out of parity, env vars out of sync with their example file, generated files out of date with their source. The [rule catalog](/reference/rule-catalog) lists every rule, its defaults, and every option it accepts.

When the built-ins do not cover your standard, add your own. A standard a regular expression can express goes in the `banned-patterns` options, in plain JSON. Anything structural becomes a rule in plain TypeScript; see [Writing rules](/reference/writing-rules).

## No baselines

There is no suppression file. A recorded violation stops being a violation, and an agent that reads one learns the standard is optional. To adopt Vibator on a codebase with existing violations, scope the run instead: `--since origin/main` checks new work immediately and old files when they are next touched. A single line can be exempted with `// vibator-ignore: <reason>`, and the reason is required.

## Where it fits

Vibator runs alongside your linter, not instead of it. Formatters own formatting and type checkers own types; Vibator checks what those tools structurally cannot see. We recommend a strict stack of Biome, knip, and dependency-cruiser next to it, and [the gate](/gate/) sets all four up in one guided run.
