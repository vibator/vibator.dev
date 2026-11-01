/** The color theme: `light`, `dark` or `system`, stored per browser and set as `data-theme`. */

/** What the person picks. */
type ColorScheme = "light" | "dark" | "system";

/** Where the choice is kept. The inline script in base.astro reads the same key. */
const storageKey = "vibator.color-scheme";

/** The system's preference. */
const darkQuery = "(prefers-color-scheme: dark)";

/** The order the toggle cycles through. */
const cycle: readonly ColorScheme[] = ["system", "light", "dark"];

/**
 * Reads the stored choice. Storage can be blocked, so a failed read means `system`.
 *
 * @returns The choice.
 */
function storedScheme(): ColorScheme {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

/**
 * Keeps a choice. A blocked storage keeps it for this page only.
 *
 * @param scheme The choice.
 * @returns Nothing.
 */
function storeScheme(scheme: ColorScheme): void {
  try {
    localStorage.setItem(storageKey, scheme);
  } catch {
    // Private windows and blocked site data keep the choice for this page only.
  }
}

/**
 * Applies a choice to the document.
 *
 * @param scheme The choice.
 * @returns Nothing.
 */
function applyScheme(scheme: ColorScheme): void {
  const dark =
    scheme === "dark" || (scheme === "system" && matchMedia(darkQuery).matches);
  const root = document.documentElement;
  root.dataset.scheme = scheme;
  root.dataset.theme = dark ? "dark" : "light";
}

/**
 * Names a choice for the toggle's label.
 *
 * @param scheme The choice.
 * @returns The label.
 */
function schemeLabel(scheme: ColorScheme): string {
  if (scheme === "system") return "Theme: system. Switch to light";
  return scheme === "light"
    ? "Theme: light. Switch to dark"
    : "Theme: dark. Switch to system";
}

/**
 * Wires the toggle buttons: each press moves to the next choice, which is kept and applied.
 *
 * @param buttons The toggle buttons.
 * @returns Nothing.
 */
export function wireSchemeToggles(buttons: Iterable<HTMLButtonElement>): void {
  const all = [...buttons];
  let current = storedScheme();
  const label = () => {
    for (const button of all) {
      button.setAttribute("aria-label", schemeLabel(current));
      button.title = schemeLabel(current);
    }
  };
  for (const button of all) {
    button.addEventListener("click", () => {
      current = cycle[(cycle.indexOf(current) + 1) % cycle.length] ?? "system";
      storeScheme(current);
      applyScheme(current);
      label();
    });
  }
  matchMedia(darkQuery).addEventListener("change", () => {
    if (current === "system") applyScheme("system");
  });
  label();
}
