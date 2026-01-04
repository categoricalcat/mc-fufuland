/**
 * Checks if a file environment is unsupported on the server
 * @param env - The environment configuration object
 * @param env.client - Client-side support status
 * @param env.server - Server-side support status
 * @returns True if the file is unsupported on the server, false otherwise
 */
export const isUnsupported = (env?: { client?: string; server?: string }): boolean =>
  env?.server === "unsupported"; 