import fs from "fs/promises";
import AdmZip from "adm-zip";

/**
 * Extracts a zip file to the specified output directory
 * @param zipPath - Path to the zip file to extract
 * @param outputDir - Directory where the zip contents will be extracted
 * @throws Will throw an error if extraction fails
 */
export const extractZip = async (
  zipPath: string,
  outputDir: string
): Promise<void> => {
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(outputDir, true);
}; 