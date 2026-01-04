import { mkdirSync } from "fs";

/**
 * Configuration for the modpack processor
 */
export const config = {
  /** Path to the modrinth index file within the modpack */
  indexPath: "modrinth.index.json",
  
  /** Path to the input modpack file */
  mrpackPath: "the-modpack.mrpack",
  
  /** Directory where the modpack will be extracted */
  backupDir: ".backups/the-modpack",
  
  /** Directory for caching Modrinth API responses */
  cacheDir: ".backups/modrinth_cache",

  /** Directory where the mods will be downloaded */
  modsDir: ".backups/mods",
  
  /** Path to the output index file */
  outputPath: "index-copy.json",
  
  /** Path to the processed modpack output */
  processedPackPath: "the-modpack-processed.mrpack",
  
  /** When true, only process files in the mods/ directory */
  modsOnly: false,
  
  /** When true, files whose env declares unsupported for client or server are ignored */
  ignoreUnsupported: false,
};

// mkdir -p for [cacheDir, modsDir]
mkdirSync(config.cacheDir, { recursive: true });
mkdirSync(config.modsDir, { recursive: true });