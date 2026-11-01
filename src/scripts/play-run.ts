/** Plays one `npx vibator` run in the hero terminal: it types the command, spins through the rules, then shows the finding. */

/** The spinner frames the vibator CLI draws. */
const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

/** The rules the run passes through, as the CLI labels them, with how long each one shows. */
const rules = [
  { label: "[1/2] no-conflict-markers", ms: 500 },
  { label: "[2/2] colors-from-tokens", ms: 700 },
];

/**
 * Waits for a time.
 *
 * @param ms The time in milliseconds.
 * @returns A promise that resolves after the time.
 */
const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Waits until an element is at least half in view.
 *
 * @param element The element.
 * @returns A promise that resolves when the element is in view.
 */
const inView = (element: Element) =>
  new Promise<void>((resolve) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          resolve();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
  });

/**
 * Plays the run in a terminal once it scrolls into view. The terminal holds `.typed`, `.spin`, and `.result`, and its
 * `data-state` attribute moves from `typing` to `running` to `done`.
 *
 * @param term The terminal element.
 * @returns A promise that resolves when the finding shows.
 */
export async function playRun(term: HTMLElement): Promise<void> {
  const typed = term.querySelector<HTMLElement>(".typed");
  const spin = term.querySelector<HTMLElement>(".spin");
  if (!typed || !spin) {
    return;
  }
  const command = typed.textContent ?? "";
  typed.textContent = "";
  term.dataset.state = "typing";
  await inView(term);
  await wait(500);
  for (const character of command) {
    typed.textContent += character;
    await wait(30 + Math.random() * 25);
  }
  await wait(250);
  term.dataset.state = "running";
  let frame = 0;
  for (const rule of rules) {
    for (let elapsed = 0; elapsed < rule.ms; elapsed += 80) {
      spin.textContent = `${frames[frame % frames.length]} ${rule.label}`;
      frame += 1;
      await wait(80);
    }
  }
  spin.textContent = "";
  term.dataset.state = "done";
}
