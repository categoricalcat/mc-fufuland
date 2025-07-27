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

const downloadFile = (url: string) => fetch(url).then((res) => {
  if (!res.body) {
    throw new Error("No body");
  }

  const fileName = url.split("/").pop()!;
  const filePath = join(process.cwd(), config.modsDir, fileName);

  console.log(`Downloading ${url} to ${filePath}`);

  const modFileStream = createWriteStream(filePath);
  void pipeline(res.body, modFileStream);

})

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

  for (const download of updatedFile.downloads) {
    await downloadFile(download);
  }

  return updatedFile;
}; 