import fs from "fs/promises";
import path, { join } from "path";
import type { ModrinthIndex, File } from "../../../types/modrinth.js";
import { extractZip, zipFolder } from "../../utils/zip/index.js";
import { mapSequentially } from "../../utils/async/index.js";
import { processFileWithDelayAndLogging } from "../file/index.js";
import { updateIndex } from "./update-index.js";
import { config } from "../../config.js";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";

const downloadFile = (url: string) => fetch(url).then(async (res) => {
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
 * Main processing pipeline for Modrinth modpacks
 * @param mrpackPath - Path to the input .mrpack file
 * @param backupDir - Directory where the modpack will be extracted
 * @param outputPath - Path where the processed index will be written
 * @returns Promise that resolves when processing is complete
 * @throws Will throw an error if any step of the processing fails
 */
export const processModpack = async (
  mrpackPath: string,
  backupDir: string,
  outputPath: string
): Promise<void> => {
  // Extract modpack
  await extractZip(mrpackPath, backupDir);
  console.log(`Extracted ${mrpackPath} to ${backupDir}`);

  // Read index
  const indexPath = path.join(backupDir, config.indexPath);
  const indexContent = await fs.readFile(indexPath, "utf-8");
  const index: ModrinthIndex = JSON.parse(indexContent);
  console.log(` Processing ${index.files.length} files from ${index.name}`);

  // Process files sequentially (for rate limiting)
  const processedFiles = await mapSequentially(index.files, (file, i) =>
    processFileWithDelayAndLogging(file, i, index.files.length)
  );

  // Create updated index
  const updatedIndex = updateIndex(
    index,
    processedFiles.filter((file): file is File => file !== null)
  );

  
  console.log(` Downloading ${updatedIndex.files.length} mods`);
  for (const file of updatedIndex.files) {
    if (file.downloads) {
      for (const download of file.downloads) {
        if (file.env.server === "required" || file.env.server === "optional") {
          await downloadFile(download);
        } else {
          console.log(`Skipping ${download} because it is ${file.env.server}`);
        }
      }
    }
  }

  // Write result files
  await Promise.all([
    fs.writeFile(outputPath, JSON.stringify(updatedIndex, null, 2)),
    fs.writeFile(indexPath, JSON.stringify(updatedIndex)), // replace in extracted folder
  ]);

  console.log(`\nProcessing complete! Modified index written to ${outputPath}`);

  // Zip the processed folder into a new mrpack
  await zipFolder(backupDir, config.processedPackPath);
  console.log(`Created processed pack at ${config.processedPackPath}`);
}; 