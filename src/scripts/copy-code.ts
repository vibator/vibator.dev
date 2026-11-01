/** Copy buttons on the code blocks of a doc. */

/** How long a button says "Copied" before it reads "Copy" again, in milliseconds. */
const confirmationTime = 1600;

/**
 * Copies text and says so on the button.
 *
 * @param button The button pressed.
 * @param text The text to copy.
 * @returns A promise that settles once the text is copied or the copy failed.
 */
async function copyWithConfirmation(
  button: HTMLButtonElement,
  text: string,
): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied";
  } catch {
    button.textContent = "Select and copy";
  }
  setTimeout(() => {
    button.textContent = "Copy";
  }, confirmationTime);
}

/**
 * Adds a copy button to each code block.
 *
 * @param blocks The `pre` elements.
 * @returns Nothing.
 */
export function addCopyButtons(blocks: Iterable<HTMLPreElement>): void {
  for (const block of blocks) {
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    block.replaceWith(wrapper);
    wrapper.append(block);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy the code");
    button.addEventListener("click", () => {
      const code =
        block.querySelector("code")?.textContent ?? block.textContent;
      copyWithConfirmation(button, code);
    });
    wrapper.append(button);
  }
}
