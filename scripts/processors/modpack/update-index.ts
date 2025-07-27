import type { ModrinthIndex, File } from "../../types/modrinth.js";

/**
 * Updates a Modrinth index with new file entries
 * @param index - The original index to update
 * @param processedFiles - The array of processed files to include in the index
 * @returns A new index object with the updated files
 */
export const updateIndex = (
  index: ModrinthIndex,
  processedFiles: File[]
): ModrinthIndex => ({
  ...index,
  files: processedFiles,
}); 