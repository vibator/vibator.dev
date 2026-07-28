# Agent skills

Vibator ships three skills for Claude Code and compatible agents:

- `configuring-vibator`: inspect a project and write or tune `.vibator.json`.
- `writing-vibator-rules`: author a rule with `defineRule` and the namespace.
- `fixing-vibator-findings`: read a report and resolve its findings.

```sh
$ npx vibator skills --install  # copy into .claude/skills/
```

## Agents without skill support

The same material is reachable from the command line, so any agent can be
pointed at it:

```sh
$ npx vibator explain <rule>    # the guideline in force for a rule
$ npx vibator --reporter json   # machine-readable findings
```

The JSON report is self-sufficient. Each finding carries its rule id, severity,
location, and the three fields an agent acts on: `message`, `expected`, and
`fix`.
