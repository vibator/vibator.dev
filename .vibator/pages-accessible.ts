import { defineRule, vibator } from "vibator";
import "./lib/site.ts";

/**
 * Violations accepted after review, by axe rule and element. pagefind's search button is named
 * "Search the docs", its visible label. axe also counts the `Ctrl K` hint, which pagefind hides
 * from screen readers, so it reports a name mismatch that WCAG 2.5.3 does not.
 */
const accepted = [
  { rule: "label-content-name-mismatch", target: ".pf-trigger-btn" },
];

export default defineRule({
  id: "pages-accessible",
  title:
    "The built pages pass axe-core for WCAG 2.2 A and AA, in light and dark, on desktop and phone",
  check: async () => {
    const violations = await vibator.site.audit(vibator.site.pages());
    return violations
      .filter(
        (found) =>
          !accepted.some(
            ({ rule, target }) =>
              found.rule === rule && found.target === target,
          ),
      )
      .map((found) => ({
        file: found.page,
        message: `${found.rule} on ${found.target} (${found.state}): ${found.message}`,
        expected:
          "Every page meets WCAG 2.2 A and AA in each scheme, width, and open state.",
        fix: "Fix the component or style that renders the element, then build again.",
      }));
  },
});
