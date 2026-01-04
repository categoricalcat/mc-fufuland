import type { File } from "../../../types/modrinth.js";
import { processFile } from "./process-file.js";
import { shouldProcessFile } from "../../utils/file/index.js";
import { delay } from "../../utils/async/index.js";
import { parseProjectId } from "../../api/modrinth/index.js";

/**
 * Processes a file with rate limiting delay and detailed logging
 * @param file - The file to process
 * @param index - The current index in the processing queue
 * @param total - The total number of files being processed
 * @returns Promise resolving to the processed file, or null if the file should be skipped
 */
export const processFileWithDelayAndLogging = async (
  file: File,
  index: number,
  total: number
): Promise<File | null> => {
  console.log(`Processing ${index + 1}/${total}: ${file.path}`);

  const processedFile = await processFile(file);

  if (!shouldProcessFile(processedFile)) {
    console.log(`Skipping ${file.path}`);
    return null;
  } else await delay(1000 / 30); // Rate limiting

  // Log results
  if (processedFile.env !== file.env) {
    console.log(
      `  Updated env for ${file.path}: client=${processedFile.env.client}, server=${processedFile.env.server}`
    );
  } else if (file.downloads?.[0]) {
    const projectId = parseProjectId(file.downloads[0]);
    console.log(
      projectId
        ? `  Failed to fetch project info for ${file.path}`
        : `  Could not extract project ID from ${file.downloads[0]}`
    );
  } else {
    console.log(`  No downloads found for ${file.path}`);
  }

  return processedFile;
}; 