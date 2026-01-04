/**
 * Wraps an async function with error handling that logs and re-throws errors
 * @param fn - The async function to wrap
 * @returns Promise that rejects with the original error after logging
 */
export const runWithErrorHandling = (fn: () => Promise<void>): Promise<void> =>
  fn().catch((error) => {
    console.error("Error processing modpack:", error);
    return Promise.reject(error);
  }); 