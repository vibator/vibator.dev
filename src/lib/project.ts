/** Facts about the vibator repository on GitHub. */

/** The repository's web address. */
export const repositoryUrl = "https://github.com/vibator/vibator";

/** The site's own repository. */
export const siteRepositoryUrl = "https://github.com/vibator/vibator.dev";

/**
 * Builds the GitHub address of a repository path.
 *
 * @param repoPath The path from the repository root, such as `skills/` or `README.md`.
 * @param ref The branch or tag, such as `main` or `v3.0.0`.
 * @returns A `tree` address for a directory, a `blob` address for a file.
 */
export function githubUrl(repoPath: string, ref: string): string {
  const name = repoPath.replace(/\/$/, "").split("/").pop() ?? "";
  // Directories are lower case without a dot; LICENSE is a file.
  const isFile =
    !repoPath.endsWith("/") && (name.includes(".") || /^[A-Z]/.test(name));
  const kind = isFile ? "blob" : "tree";
  return `${repositoryUrl}/${kind}/${ref}/${repoPath.replace(/\/$/, "")}`;
}
