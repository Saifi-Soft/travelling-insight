
/**
 * Helper utility for safely adding items to arrays in state
 * 
 * @param item The item to add to the array
 * @param array The current array
 * @param setter React setState function for the array
 * @returns true if item was added, false otherwise
 */
export const addItemToArray = (
  item: string, 
  array: string[], 
  setter: React.Dispatch<React.SetStateAction<string[]>>
): boolean => {
  if (item && !array.includes(item)) {
    setter(prevArray => [...prevArray, item]);
    return true;
  }
  return false;
};
