/**
 * Creates a promise that resolves after the specified delay
 * @param ms - The delay in milliseconds
 * @returns A promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms)); 