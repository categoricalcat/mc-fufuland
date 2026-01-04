import fs from "fs/promises";
import { dirname, join } from "path";

/**
 * Higher-order function that adds file-based caching to an async function
 * @template Arg - The type of the function argument
 * @template Res - The type of the function result
 * @param cacheDir - Directory where cache files will be stored
 * @param cacheKey - Function that generates a cache key from the argument
 * @param fn - The async function to wrap with caching
 * @returns A new function with caching behavior
 */
export const withFileCache =
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