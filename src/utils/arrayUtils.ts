
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
  setter: React.Dispatch<React.SetStateAction<any>>
): boolean => {
  if (item && !array.includes(item)) {
    if (typeof setter === 'function') {
      // Handle both direct array state and complex object state
      setter((prevState: any) => {
        // If the setter is for a nested property in an object
        if (typeof prevState === 'object' && !Array.isArray(prevState)) {
          // Find the right property to update by matching the array
          for (const key in prevState) {
            if (Array.isArray(prevState[key]) && prevState[key] === array) {
              return {
                ...prevState,
                [key]: [...array, item]
              };
            }
          }
        }
        
        // Direct array state setter
        return Array.isArray(prevState) ? [...prevState, item] : prevState;
      });
    }
    return true;
  }
  return false;
};

/**
 * Calculate compatibility score between two sets of interests or travel styles
 * 
 * @param userPreferences Array of user preferences 
 * @param otherPreferences Array of other user preferences to compare with
 * @returns Compatibility score as a percentage (0-100)
 */
export const calculateCompatibility = (
  userPreferences: string[],
  otherPreferences: string[]
): number => {
  if (!userPreferences.length || !otherPreferences.length) return 0;
  
  // Count matching items
  const matches = userPreferences.filter(pref => 
    otherPreferences.includes(pref)
  ).length;
  
  // Calculate weighted score based on both arrays
  const totalUniqueItems = new Set([...userPreferences, ...otherPreferences]).size;
  const score = (matches / totalUniqueItems) * 100;
  
  return Math.round(score);
};

/**
 * Generate intelligent travel matches based on preferences
 * 
 * @param userPreferences User's travel preferences
 * @param potentialMatches Array of other users with their preferences
 * @returns Array of matches sorted by compatibility score
 */
export const generateIntelligentMatches = (
  userPreferences: {
    destinations: string[];
    travelStyles: string[];
    interests: string[];
  },
  potentialMatches: Array<{
    userId: string;
    destinations: string[];
    travelStyles: string[];
    interests: string[];
    name?: string;
    avatar?: string;
  }>
) => {
  return potentialMatches
    .map(match => {
      // Calculate separate scores for each preference type
      const destinationScore = calculateCompatibility(
        userPreferences.destinations,
        match.destinations
      );
      
      const styleScore = calculateCompatibility(
        userPreferences.travelStyles,
        match.travelStyles
      );
      
      const interestScore = calculateCompatibility(
        userPreferences.interests,
        match.interests
      );
      
      // Calculate weighted overall score (destinations matter more)
      const overallScore = Math.round(
        (destinationScore * 0.5) + (styleScore * 0.25) + (interestScore * 0.25)
      );
      
      return {
        ...match,
        compatibilityScore: overallScore
      };
    })
    .filter(match => match.compatibilityScore > 30) // Only return matches above 30% compatibility
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};

