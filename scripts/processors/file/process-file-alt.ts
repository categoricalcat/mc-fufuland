import type { File } from "../../types/modrinth.js";
import { parseProjectId, fetchProject } from "../../api/modrinth/index.js";
import { createUpdatedFile } from "./create-updated-file.js";

/**
 * Alternative file processor that tries all download URLs sequentially
 * @param file - The file to process
 * @returns Promise resolving to the processed file with updated environment info, or the original file if no project is found
 */
export const processFileAlt = async (file: File): Promise<File> => {
  const downloads = file.downloads ?? [];

  // Iterate sequentially to honour Modrinth's rate-limit (one request per file anyway)
  for (const url of downloads) {
    const projectId = parseProjectId(url);
    if (!projectId) continue;

    const project = await fetchProject(projectId);
    if (project) {
      return createUpdatedFile(file, project);
    }
  }

  // If none of the downloads yielded a project, return the original file untouched.
  return file;
}; 