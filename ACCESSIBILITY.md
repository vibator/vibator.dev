# Accessibility

The site at [vibator.dev](https://vibator.dev) aims to meet
[WCAG 2.2](https://www.w3.org/TR/WCAG22/) at level AA. Nobody has audited it by
hand, so this is the goal the checks test against, not a claim of conformance.

The vibator command line and its documentation have their own
[accessibility statement](https://github.com/vibator/vibator/blob/main/ACCESSIBILITY.md).

## How it is checked

- axe-core checks every page of the built site for WCAG 2.0, 2.1, and 2.2 A and AA, in light and dark, at desktop and phone width: each page as it loads, the search dialog open with results, and the docs menu open. The `pages-accessible` rule in `.vibator/` runs it: `bun run rules` after a build, `bun run verify`, and CI.
- One axe finding is accepted after review: the search button's name is its visible label, "Search the docs", and axe also counts the keyboard hint that the button hides from screen readers.

## What the site does

- A skip link leads to the content.
- Every control has a name, and keyboard focus shows an outline.
- The theme follows the system setting, and the theme button switches between system, light, and dark.
- Text keeps a contrast of 4.5:1 or more in both themes.
- The animated terminal on the home page follows the system's reduce motion setting. Screen readers get its result as text instead of the animation.
- Code blocks and wide tables take keyboard focus, so the arrow keys scroll them.
- Images carry alt text, or are hidden from screen readers when they are decoration.
- The docs come from Markdown that the vibator repository checks for alt text, heading order, and link text.

## Known limitations

- axe-core finds part of the WCAG issues, about 57% by its maker Deque's count. The rest needs a review by hand, which has not been done.
- VoiceOver, TalkBack, NVDA, and JAWS have not been tested by hand.
- Windows high contrast mode (forced colors) has not been checked.
- Wide tables take keyboard focus through a script. Without JavaScript, they scroll only with a pointer.
- The search dialog comes from Pagefind. Its keyboard and screen reader behavior is Pagefind's.

## Report a barrier

[Open an accessibility issue](https://github.com/vibator/vibator.dev/issues/new?template=03_accessibility.yml)
and say what stopped you, on which page, with which device, browser, and
assistive technology. Every report is read. There is no fixed timeline for a
fix.
