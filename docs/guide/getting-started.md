# Getting started

## Quick setup

```sh
$ npx @vibator/create-gate
```

Follow the wizard and then install the packages with:

```sh
$ npm install
```

Plugins and rules configuration are written in the  `.vibator.json` file,
and each tool has its own configuration under `.vibator/` folder.

If you are done, jump to the [Run it](#run-it) section.

## Install it yourself

To start from nothing and write your own rules, install Vibator as a dev
dependency:

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
`typescript` is an optional peer dependency, used by the `ts` namespace for
AST-based and type-aware rules. Supported versions are 5.4 up to 6.x; the rules
resolve and use your project's own installation.
:::

## Write your first rule

Vibator ships no rules. A rule lives in the project's `.vibator/` folder, which
loads automatically, or in a package listed under `plugins`. A rule reads the
project through the [`vibator` namespace](/reference/vibator-namespace) and
returns findings. See the [rule definition](/reference/rule-definition) for the
full shape.

## Scaffold the config

`.vibator.json` at the project root is optional and configures the rules you
load. Write a starter file:

```sh
$ npx vibator init
```

See the [configuration reference](/reference/configuration) for every field.

## Run it

```sh
$ npx vibator                     # run every enabled rule
$ npx vibator --write             # run each rule's fix, then recheck
$ npx vibator list                # every rule, its severity and title
$ npx vibator explain <rule>      # the guideline behind a rule
$ npx vibator --only <ids>        # run only these rule ids
$ npx vibator --reporter sarif    # pretty (default), json, or sarif
```

## Adopt on an existing codebase

To check only new work, scope the run:

```sh
$ npx vibator --since origin/main   # everything this branch touched
$ npx vibator --changed             # every uncommitted change
$ npx vibator --staged              # files staged for the next commit
```
