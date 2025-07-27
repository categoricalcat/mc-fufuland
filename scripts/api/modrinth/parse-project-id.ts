/**
 * Extracts the project ID from a Modrinth CDN URL
 * @param url - The Modrinth CDN URL (e.g., "https://cdn.modrinth.com/data/{project_id}/versions/{version_id}/file.jar")
 * @returns The project ID if found, null otherwise
 * @example
 * parseProjectId("https://cdn.modrinth.com/data/ABC123/versions/xyz/mod.jar") // returns "ABC123"
 */
export const parseProjectId = (url: string): string | null =>
  url?.split?.("/")?.[4] ?? null; 