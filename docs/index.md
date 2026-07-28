---
layout: home

hero:
  name: Vibator
  text: Rules for your own standards
  tagline: An unopinionated linter for JavaScript and TypeScript. Write the checks other tools cannot, and link every finding to the guideline behind it.
  image:
    src: /logo.svg
    alt: Vibator
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: What is Vibator?
      link: /guide/what-is-vibator
    - theme: alt
      text: GitHub
      link: https://github.com/vibator/vibator

features:
  - icon: 🧩
    title: Unopinionated
    details: Vibator ships no rules of its own. It gives you the utilities to turn your own standards into actionable checks.
    link: /guide/what-is-vibator
    linkText: Why Vibator
  - icon: ✍️
    title: Highly customizable
    details: Rules are plain JavaScript or TypeScript, with no DSL or pipeline to learn. When a rule runs, you control what its diagnostics look like.
    link: /guide/getting-started
    linkText: Getting started
  - icon: 🤖
    title: Integrates with coding agents
    details: Ships with agent skills, and a rule links to a guideline, so an agent has the detail it needs to act on a finding.
    link: /guide/agent-skills
    linkText: Agent skills
  - icon: 🔌
    title: SARIF compatible
    details: Drop Vibator into the code-scanning and CI workflows you already run.
    link: /reference/command-line#reporters
    linkText: Reporters
---

## Add it to a project

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

Vibator ships no rules of its own. Scaffold a `.vibator.json` and start writing them:

```sh
$ npx vibator init
```
