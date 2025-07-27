import type { ModrinthProject } from "../../../types/modrinth-project.js";

/**
 * Fetches project data from the Modrinth API
 * @param projectId - The Modrinth project ID
 * @returns Promise resolving to the project data, or null if the request fails
 */
export const fetchProject = (projectId: string): Promise<ModrinthProject | null> =>
  fetch(`https://api.modrinth.com/v2/project/${projectId}`)
    .then((res) => (res.ok ? (res.json() as Promise<ModrinthProject>) : null))
    .catch(() => null); 