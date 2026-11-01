/** Closes the docs' version menus on a press outside them or on Escape. */

/**
 * Wires every version menu of the page. The menus are `<details>` elements, which open and close
 * on their own summary without script.
 *
 * @returns Nothing.
 */
export function wireVersionMenus(): void {
  const menus = [
    ...document.querySelectorAll<HTMLDetailsElement>("details[data-versions]"),
  ];
  if (menus.length === 0) return;
  document.addEventListener("click", (event) => {
    for (const menu of menus) {
      if (menu.open && !menu.contains(event.target as Node)) menu.open = false;
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    for (const menu of menus.filter((each) => each.open)) {
      menu.open = false;
      menu.querySelector("summary")?.focus();
    }
  });
}
