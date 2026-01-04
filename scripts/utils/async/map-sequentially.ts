/**
 * Maps over an array sequentially, applying an async function to each item
 * @template T - The type of the input array items
 * @template R - The type of the returned array items
 * @param items - The array of items to process
 * @param fn - The async function to apply to each item
 * @returns Promise resolving to an array of processed items
 */
export const mapSequentially = async <T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> => {
  const results: R[] = [];
  for (let i = 0; i < items.length; i++) {
    results.push(await fn(items[i], i));
  }
  return results;
}; 