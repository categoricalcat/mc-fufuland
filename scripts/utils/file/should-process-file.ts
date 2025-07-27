import type { File } from "../../types/modrinth.js";
import { config } from "../../config.js";
import { isUnsupported } from "./is-unsupported.js";

/**
 * Determines whether a file should be processed based on configuration
 * @param file - The file to check
 * @returns True if the file should be processed, false otherwise
 */
export const shouldProcessFile = (file: File): boolean => {
  if (config.modsOnly && !file.path?.startsWith("mods/")) {
    return false;
  }
  if (config.ignoreUnsupported && isUnsupported(file.env)) {
    return false;
  }
  return true;
}; 