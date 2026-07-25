# Agent skills

Vibator ships three skills for Claude Code and compatible agents. A skill is a short instruction set the agent loads when the task calls for it, so the tool is used the way it was designed to be used.

- `configuring-vibator`: inspect a project and write a fitting configuration.
- `fixing-vibator-findings`: consume the JSON report and resolve findings at their source.
- `writing-vibator-rules`: author a project rule, its guideline, and its tests.

```sh
$ npx vibator skills            # list what is bundled
$ npx vibator skills --install  # copy into .claude/skills/
```

## The gate skill

[The gate](/gate/) adds a fourth: `using-the-vibator-gate` covers running the gate, acting on findings, and adjusting standards in the thin configs. Copy `skills/using-the-vibator-gate/` from the `@vibator/gate` package into your agent's skills directory. The wizard lists all four skills in the `AGENTS.md` section it writes.

## Agents without skill support

The same material is reachable from the command line, so any agent can be pointed at it:

```sh
$ npx vibator explain <rule>   # the guideline in force for a rule
$ npx vibator docs <topic>     # a bundled document: writing-rules, configuration, rules
```

The JSON report is self-sufficient: each finding carries its snippet and an absolute path to every guideline, so an agent acting on it never needs to know where the package manager installed the package.
