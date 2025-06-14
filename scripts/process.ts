// unzip the-modpack.mrpack into .backups/the-modpack
// start processing modrinth.index.json
// get all ModrinthIndex["files"][number]["downloads"]
// "https://cdn.modrinth.com/data/{project_id}/versions/{version_id}/file.jar"
// for each download, get project_id and fetch "https://api.modrinth.com/v2/project/{project_id}"
// replace  ModrinthIndex["files"][number]["env"] with  ModrinthProject["client_side"] and ModrinthProject["server_side"] from request
// write copy index-copy.json

import fs from "fs/promises";
import path, { dirname, join } from "path";
import AdmZip from "adm-zip";
import { promises as fsp } from "fs";
import type { ModrinthIndex, File } from "../types/modrinth";
import type { ModrinthProject } from "../types/modrinth-project";

// Configuration
const config = {
  indexPath: "modrinth.index.json",
  mrpackPath: "the-modpack.mrpack",
  backupDir: ".backups/the-modpack",
  cacheDir: ".backups/modrinth_cache",
  outputPath: "index-copy.json",
  processedPackPath: "the-modpack-processed.mrpack",
  modsOnly: false,
  /** When true, files whose env declares unsupported for client or server are ignored */
  ignoreUnsupported: false,
};

// Utility to decide whether a file should be processed based on config.modsOnly
const isUnsupported = (env?: { client?: string; server?: string }): boolean =>
  env?.server === "unsupported";

const shouldProcessFile = (file: File): boolean => {
  if (config.modsOnly && !file.path?.startsWith("mods/")) {
    return false;
  }
  if (config.ignoreUnsupported && isUnsupported(file.env)) {
    return false;
  }
  return true;
};

// Pure function to extract zip file
const extractZip = async (
  zipPath: string,
  outputDir: string
): Promise<void> => {
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(outputDir, true);
};

// Pure function to zip a folder into an .mrpack file
const zipFolder = (folder: string, outZip: string): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      const zip = new AdmZip();
      zip.addLocalFolder(folder);
      zip.writeZip(outZip, (err) => (err ? reject(err) : resolve()));
    } catch (err) {
      reject(err);
    }
  });

// Pure function to parse project ID from URL
const parseProjectId = (url: string): string | null =>
  url?.split?.("/")?.[4] ?? null;

// Pure function to fetch project data
const fetchProject = (projectId: string): Promise<ModrinthProject | null> =>
  fetch(`https://api.modrinth.com/v2/project/${projectId}`)
    .then((res) => (res.ok ? (res.json() as Promise<ModrinthProject>) : null))
    .catch(() => null);

// Higher-order cache layer
const withFileCache =
  <Arg, Res>(
    cacheDir: string,
    cacheKey: (arg: Arg) => string,
    fn: (arg: Arg) => Promise<Res>
  ) =>
  (arg: Arg): Promise<Res> => {
    const filePath = join(cacheDir, cacheKey(arg));
    // Try reading the cache
    return fs
      .readFile(filePath, "utf8")
      .then((raw) => JSON.parse(raw) as Res)
      .catch(() => fn(arg))
      .then((res) =>
        fs
          .mkdir(dirname(filePath), { recursive: true })
          .then(() => fs.writeFile(filePath, JSON.stringify(res), "utf8"))
          .then(() => res)
      );
  };

// Instantiate your cached version
const cacheDir = join(__dirname, "..", config.cacheDir);
const cachedFetchProject = withFileCache(
  cacheDir,
  (id) => `${id}.json`,
  fetchProject
);

// Pure function to create updated file entry
const createUpdatedFile = (file: File, project: ModrinthProject): File => ({
  ...file,
  env: {
    client: project.client_side,
    server: project.server_side,
  },
});

// Helper to add delay
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// <<<<<<<<<<<<<<<<<
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

// Pure function to process a single file
const processFile = async (file: File): Promise<File> => {
  const projectId = file.downloads?.[0]
    ? parseProjectId(file.downloads[0])
    : null;

  if (!projectId) return file;

  const project = await cachedFetchProject(projectId);
  // const project = await fetchProject(projectId);
  return project ? createUpdatedFile(file, project) : file;
};

// Process file with delay and logging
const processFileWithDelayAndLogging = async (
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

// Sequential map function
const mapSequentially = async <T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> => {
  const results: R[] = [];
  for (let i = 0; i < items.length; i++) {
    results.push(await fn(items[i], i));
  }
  return results;
};

// Pure function to update index with processed files
const updateIndex = (
  index: ModrinthIndex,
  processedFiles: File[]
): ModrinthIndex => ({
  ...index,
  files: processedFiles,
});

// Main processing pipeline
const processModpack = async (
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
  console.log(`Processing ${index.files.length} files from ${index.name}`);

  // Process files sequentially (for rate limiting)
  const processedFiles = await mapSequentially(index.files, (file, i) =>
    processFileWithDelayAndLogging(file, i, index.files.length)
  );

  // Create updated index
  const updatedIndex = updateIndex(
    index,
    processedFiles.filter((file) => file !== null)
  );

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

// Error handling wrapper without try/catch – relies on promise rejection handling
const runWithErrorHandling = (fn: () => Promise<void>): Promise<void> =>
  fn().catch((error) => {
    console.error("Error processing modpack:", error);
    return Promise.reject(error);
  });

// Entry point
runWithErrorHandling(() =>
  processModpack(config.mrpackPath, config.backupDir, config.outputPath)
);
