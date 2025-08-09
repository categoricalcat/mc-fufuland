import type { File } from "../../../types/modrinth.js";
import { parseProjectId, fetchProject } from "../../api/modrinth/index.js";
import { withFileCache } from "../../utils/cache/index.js";
import { createUpdatedFile } from "./create-updated-file.js";
import { join } from "path";
import { config } from "../../config.js";
import { createWriteStream } from "fs";
import { pipeline } from 'stream/promises';

// Create cached version of fetchProject
const cacheDir = join(process.cwd(), config.cacheDir);
const cachedFetchProject = withFileCache(
  cacheDir,
  (id: string) => `${id}.json`,
  fetchProject
);



/**
 * Processes a single file by fetching project information and updating its environment configuration
 * @param file - The file to process
 * @returns Promise resolving to the processed file with updated environment info, or the original file if processing fails
 */
export const processFile = async (file: File): Promise<File> => {
  const projectId = file.downloads?.[0]
    ? parseProjectId(file.downloads[0])
    : null;

  if (!projectId) return file;

  const project = await cachedFetchProject(projectId);
  const updatedFile = project ? createUpdatedFile(file, project) : file;

  return updatedFile;
}; 