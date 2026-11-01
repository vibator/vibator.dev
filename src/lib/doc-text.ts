/** What the site reads out of a doc's Markdown: its title and its description. */

/**
 * Reads the doc's title from its first `# ` heading.
 *
 * @param markdown The doc.
 * @returns The heading's text, Markdown included, or `undefined` when the doc has none.
 */
export function docTitle(markdown: string): string | undefined {
  return /^# (.+)$/m.exec(markdown)?.[1]?.trim();
}

/**
 * Turns Markdown inline syntax into plain text: links keep their text, emphasis and code marks go.
 *
 * @param text Inline Markdown.
 * @returns Plain text.
 */
export function plainText(text: string): string {
  return text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\\([<>|])/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** A run of a title: plain text, or inline code. */
export interface TitlePart {
  /** The run's text. */
  readonly text: string;
  /** Whether the run was written in backticks. */
  readonly code: boolean;
}

/**
 * Splits a title into plain and code runs, so `` `vibator` namespace `` keeps its code font.
 *
 * @param title The title as written.
 * @returns The runs, in order.
 */
export function titleParts(title: string): TitlePart[] {
  return title
    .split("`")
    .map((text, index) => ({ text, code: index % 2 === 1 }))
    .filter((part) => part.text !== "");
}

/**
 * Tells whether a block of Markdown is a paragraph of prose, not a heading, list, table, quote,
 * code or HTML.
 *
 * @param block The block, as separated by blank lines.
 * @returns `true` for prose.
 */
function isProse(block: string): boolean {
  return (
    block !== "" && !/^(#|[-*+] |\d+\. |\||>|```|~~~|<|!\[|---)/.test(block)
  );
}

/**
 * Shortens text at a word boundary, with an ellipsis when cut.
 *
 * @param text The text.
 * @param length The longest result, ellipsis included.
 * @returns The text, whole or cut.
 */
function shorten(text: string, length: number): string {
  if (text.length <= length) return text;
  const cut = text.slice(0, length - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}…`;
}

/**
 * Reads the doc's description: its first paragraph of prose, as plain text, about 155 characters.
 *
 * @param markdown The doc.
 * @returns The description, or an empty string when the doc has no prose.
 */
export function docDescription(markdown: string): string {
  const blocks = markdown.split(/\n\s*\n/).map((block) => block.trim());
  const paragraph = blocks.find(isProse);
  return paragraph === undefined ? "" : shorten(plainText(paragraph), 155);
}
