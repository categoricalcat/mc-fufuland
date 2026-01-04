import type { File } from "../../../types/modrinth.js";
import type { ModrinthProject } from "../../../types/modrinth-project.js";

/**
 * Creates an updated file entry with environment information from the project
 * @param file - The original file entry
 * @param project - The Modrinth project data containing client/server side information
 * @returns A new file object with updated environment configuration
 */
export const createUpdatedFile = (file: File, project: ModrinthProject): File => ({
  ...file,
  env: {
    client: project.client_side,
    server: project.server_side,
  },
}); 