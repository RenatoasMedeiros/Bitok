// src/utils/preferences.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export type Preferences = {
  categories: { [category: string]: number };
  priceRanges: { [priceRange: string]: number };
};

export const defaultPreferences: Preferences = {
  categories: {},
  priceRanges: {},
};

const PREFERENCES_KEY = 'user_preferences';

/**
 * Load user preferences from AsyncStorage.
 */
export const loadPreferences = async (): Promise<Preferences> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PREFERENCES_KEY);
    const preferences: Preferences = jsonValue != null ? JSON.parse(jsonValue) : defaultPreferences;

    // Ensure each preference type is an object
    preferences.categories = typeof preferences.categories === 'object' && preferences.categories !== null ? preferences.categories : {};
    preferences.priceRanges = typeof preferences.priceRanges === 'object' && preferences.priceRanges !== null ? preferences.priceRanges : {};

    console.log('Preferences loaded:', preferences);
    return preferences;
  } catch (e) {
    console.error('Failed to load preferences:', e);
    return defaultPreferences;
  }
};

/**
 * Save user preferences to AsyncStorage.
 * @param preferences Preferences to save.
 */
export const savePreferences = async (preferences: Preferences): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(preferences);
    await AsyncStorage.setItem(PREFERENCES_KEY, jsonValue);
    console.log('Preferences saved:', jsonValue);
  } catch (e) {
    console.error('Failed to save preferences:', e);
  }
};

/**
 * Add or update a category preference with weight.
 * @param newCategory Category to add or update.
 */
export const addOrUpdateCategoryPreference = async (newCategory: string): Promise<void> => {
  try {
    const preferences = await loadPreferences();
    if (preferences.categories[newCategory]) {
      preferences.categories[newCategory] += 1; // Increment weight
    } else {
      preferences.categories[newCategory] = 1; // Initialize weight
    }
    await savePreferences(preferences);
    console.log(`Category preference updated: ${newCategory}`, preferences.categories);
  } catch (e) {
    console.error('Failed to add/update category preference:', e);
  }
};

/**
 * Add or update a price range preference with weight.
 * @param newPriceRange Price range to add or update.
 */
export const addOrUpdatePriceRangePreference = async (newPriceRange: string): Promise<void> => {
  try {
    const preferences = await loadPreferences();
    if (preferences.priceRanges[newPriceRange]) {
      preferences.priceRanges[newPriceRange] += 1; // Increment weight
    } else {
      preferences.priceRanges[newPriceRange] = 1; // Initialize weight
    }
    await savePreferences(preferences);
    console.log(`Price range preference updated: ${newPriceRange}`, preferences.priceRanges);
  } catch (e) {
    console.error('Failed to add/update price range preference:', e);
  }
};

/**
 * Reset all preferences to default.
 */
export const resetPreferences = async (): Promise<void> => {
  try {
    await savePreferences(defaultPreferences);
    console.log('Preferences have been reset to default.');
  } catch (e) {
    console.error('Failed to reset preferences:', e);
  }
};
