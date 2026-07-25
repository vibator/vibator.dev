# Getting started

## Prerequisites

- [Node.js](https://nodejs.org/) version 22 or higher.
- A git repository. Vibator asks git which files exist, so `.gitignore` is honored and generated output stays out of results.

## Set up the gate

The fastest start is the gate: one guided run sets up Biome, knip, dependency-cruiser, and Vibator, wired to shared presets your project extends.

::: code-group

```sh [npm]
$ npm create @vibator/gate
```

```sh [pnpm]
$ pnpm create @vibator/gate
```

```sh [yarn]
$ yarn create @vibator/gate
```

```sh [bun]
$ bun create @vibator/gate
```

:::

The wizard walks numbered steps, one per tool. Each step shows what the tool is for, the exact changes as a diff, and the warnings. Nothing is applied until you say yes. It never overwrites an existing configuration: existing configs get an `extends` entry, existing hooks get the missing lines, everything else stays yours.

When the wizard finishes, run the whole gate:

```sh
$ npm run verify
```

Running from a script or CI? Every prompt has a flag, so the wizard never hangs:

```sh
$ npm create @vibator/gate -- --defaults            # accept the recommendations
$ npm create @vibator/gate -- --defaults --dry-run  # print the plan as JSON, change nothing
```

See [The gate](/gate/) for what the presets enforce and how to adjust a standard for one project.

## Add Vibator on its own

Vibator works standalone. Install it as a dev dependency:

::: code-group

```sh [npm]
$ npm install --save-dev vibator
```

```sh [pnpm]
$ pnpm add -D vibator
```

```sh [yarn]
$ yarn add -D vibator
```

```sh [bun]
$ bun add -d vibator
```

:::

::: info TypeScript is optional
`typescript` is an optional peer dependency, needed only by the type-aware rules. Supported versions are 5.4 up to 6.x; the rules resolve and use your project's own installation.
:::

### First run

```sh
$ npx vibator
```

With no config file, every built-in rule runs at its own default severity. The exit code is 1 when any error-severity finding is reported; warnings alone exit 0. Every rule runs even after one fails, so a failing check never hides the results of the others.

Write a starting configuration when you want to tune severities, globs, or options:

```sh
$ npx vibator init
```

This creates a `vibator.json` with a `$schema` line, so your editor autocompletes and validates every rule's options. The [configuration reference](/reference/configuration) covers every field.

### Commands you will use

```sh
$ npx vibator list                    # every rule, its default severity and title
$ npx vibator explain tsdoc-coverage  # the guideline behind a rule
$ npx vibator --only tsdoc-coverage   # run one rule
$ npx vibator --reporter json         # machine-readable output, for CI and agents
```

### Adopt on an existing codebase

Do not record existing violations; scope the run to what changed instead. New work is checked immediately, and old files are checked when they are next touched:

```sh
$ npx vibator --since origin/main   # everything this branch touched: the right scope for a PR check
$ npx vibator --changed             # every uncommitted change
$ npx vibator --staged              # files staged for the next commit: for pre-commit hooks
```

## Next steps

- Read [What is Vibator?](/guide/what-is-vibator) for the reasoning behind the tool.
- Browse the [rule catalog](/reference/rule-catalog) and enable the rules that need options, such as `locale-parity` and `banned-patterns`.
- Add your own standards with [Writing rules](/reference/writing-rules).
- Install the [agent skills](/guide/agent-skills) so your agent configures the tool and fixes findings itself.
