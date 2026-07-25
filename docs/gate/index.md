# What the gate is

The gate bootstraps guard rails for vibe coders. One guided run sets up Biome, knip, dependency-cruiser, and Vibator, and a shared package carries the configurations your project extends.

```sh
$ npm create @vibator/gate
```

Two packages, released together:

| Package                | What it is                                |
|------------------------|-------------------------------------------|
| `@vibator/gate`        | The shared configurations projects extend |
| `@vibator/create-gate` | The wizard that sets a repository up      |

## How the wizard works

The wizard walks numbered steps, one per tool. Each step shows what the tool is for, the exact changes as a diff, and the warnings. Say yes and the step is applied. Follow-ups such as `biome migrate` or replacing a taken npm script run only if you say yes to them too. Re-running is safe: it asks again and fixes only what is missing.

## How it stays current

The wizard holds no configuration content. It writes thin configs that extend `@vibator/gate` and installs each tool as a devDependency. To update the standards across every gated project, bump `@vibator/gate`.

## The presets

Each preset is one `extends` line in a thin local config:

| Preset                    | Enforces                                                                             |
|---------------------------|--------------------------------------------------------------------------------------|
| `@vibator/gate/biome`     | Strict format and lint: complexity at most 8, functions at most 25 lines, files at most 400 lines |
| `@vibator/gate/depcruise` | No cycles, no test imports in production code, no undeclared or dev dependencies in production code |
| `@vibator/gate/vibator`   | TSDoc on every declaration, meaningful names, array methods over single-statement loops, no deprecated APIs |
| `@vibator/gate/tsconfig`  | Strictness flags only; module, target, and paths stay yours                          |

knip has no extends mechanism and runs with its defaults. commitlint extends `@commitlint/config-conventional` directly.

The [standards](/gate/standards) page explains each standard, the failure it prevents, and how to adjust one for your project without weakening it for all.

## What it never does

- Overwrite or delete an existing configuration. Existing configs get an `extends` entry, existing hooks get the missing lines, everything else stays yours.
- Impose an orchestrator. It suggests a `verify` npm script; how you chain the tools is your call.
- Hang without a terminal. Every prompt has a flag, so scripts can run it end to end.

## Without a terminal

```sh
$ npm create @vibator/gate -- --defaults              # accept the recommendations
$ npm create @vibator/gate -- --defaults --dry-run    # JSON plan, no changes
$ npm create @vibator/gate -- --lint=extend --knip=yes --depcruise=yes \
    --vibator=create --tsconfig=yes --hooks=yes --commitlint=yes \
    --ci=skip --agents=yes --migrations=yes
```

Without a terminal and without enough flags it exits with code 2 and prints the way out. It never hangs. After an interactive session it prints the flags-only command that repeats the same choices. `--help` lists every flag.
