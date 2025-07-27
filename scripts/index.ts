import { config } from "./config.js";
import { processModpack } from "./processors/modpack/index.js";
import { runWithErrorHandling } from "./utils/async/index.js";

/**
 * Main entry point for the modpack processor
 * Processes a Modrinth modpack by updating file environment configurations
 */
runWithErrorHandling(() =>
  processModpack(config.mrpackPath, config.backupDir, config.outputPath)
); 