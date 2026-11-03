/** The docs sidebar: its groups, their order and each page's label, by slug. */

/** A page of the sidebar. */
export interface DocNavItem {
  /** The page's slug under `docs/`. */
  readonly slug: string;
  /** The label in the sidebar. */
  readonly label: string;
}

/** A group of the sidebar. */
interface DocNavGroup {
  /** The group's heading. */
  readonly label: string;
  /** Its pages, in order. */
  readonly items: readonly DocNavItem[];
}

/** The sidebar. The docs carry no frontmatter, so this list holds the order. */
export const docNav: readonly DocNavGroup[] = [
  {
    label: "Guide",
    items: [
      { slug: "what-is-vibator", label: "What is vibator?" },
      { slug: "getting-started", label: "Getting started" },
      { slug: "from-script-to-rule", label: "From script to rule" },
      { slug: "plugins", label: "Plugins and shared configuration" },
      { slug: "agent-skills", label: "Agent skills" },
    ],
  },
  {
    label: "Reference",
    items: [
      { slug: "vibator-namespace", label: "Namespace" },
      { slug: "rule-definition", label: "Rule definition" },
      { slug: "configuration", label: "Configuration" },
      { slug: "command-line", label: "Command line" },
    ],
  },
];

/** Every page of the sidebar, in order. */
export const docNavItems: readonly DocNavItem[] = docNav.flatMap(
  (group) => group.items,
);

/** The docs' first page, which `docs/` and each version's home open. */
export const firstDocSlug = docNavItems[0]?.slug ?? "what-is-vibator";
