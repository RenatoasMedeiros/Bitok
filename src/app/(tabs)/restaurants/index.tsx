// src/app/(tabs)/restaurants/index.tsx

import React, { useEffect, useState, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableOpacity,
  Button,
} from 'react-native';
import { supabase } from '../../../../lib/supabase';
import RestaurantListItem from '../../../components/RestaurantListItem';
import { Restaurant } from '../../../types';
import InputFilter from '@/components/InputFilter'; // Import the enhanced InputFilter component
import { loadPreferences, resetPreferences as resetUserPreferences, Preferences, defaultPreferences } from '../../../utils/preferences'; // Import the utility

export default function RestaurantsScreen() {
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]); // Stores all fetched restaurants
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // Separate search terms for different filter types
  const [searchTermCategory, setSearchTermCategory] = useState<string>(''); 
  const [searchTermPrice, setSearchTermPrice] = useState<string>(''); 

  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences); // State for user preferences

  // Fetch user preferences on component mount
  const fetchPreferencesData = async () => {
    const prefs = await loadPreferences();
    setPreferences(prefs);
    console.log('Preferences loaded and set in state:', prefs);
    
    // Update local filter states based on loaded preferences
    const loadedCategories = Object.keys(prefs.categories);
    const loadedPriceRanges = Object.keys(prefs.priceRanges);
    
    if (loadedCategories.length > 0) {
      setSearchTermCategory(loadedCategories[0]); // Assuming highest preference is first
    }
    
    if (loadedPriceRanges.length > 0) {
      setSearchTermPrice(loadedPriceRanges[0]); // Assuming highest preference is first
    }
  };

  // Fetch restaurants from Supabase
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from<Restaurant>('restaurants')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      setAllRestaurants(data || []);
      console.log('Fetched Restaurants:', data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferencesData();
    fetchRestaurants();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPreferencesData();
    await fetchRestaurants();
    setRefreshing(false);
  };

  // Reset Preferences Function
  const handleResetPreferences = async () => {
    await resetUserPreferences();
    setPreferences(defaultPreferences);
    setSearchTermCategory('');
    setSearchTermPrice('');
    console.log('Preferences have been reset.');
  };

  // Memoized filtered restaurants based on search terms and preferences
  const filteredRestaurants = useMemo(() => {
    let filtered = allRestaurants;

    // Apply category filter
    if (searchTermCategory) {
      const lowerSearch = searchTermCategory.toLowerCase();
      filtered = filtered.filter((restaurant) => {
        const name = restaurant.name.toLowerCase();
        const category = restaurant.category.toLowerCase();

        return (
          name.includes(lowerSearch) ||
          category.includes(lowerSearch)
        );
      });
    }

    // Apply price range filter
    if (searchTermPrice) {
      filtered = filtered.filter((restaurant) => {
        return restaurant.price === searchTermPrice;
      });
    }

    // Apply preference-based sorting
    if (preferences) {
      const { categories, priceRanges } = preferences;

      filtered = filtered.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        // Score based on category preference
        if (categories[a.category]) scoreA += categories[a.category];
        if (categories[b.category]) scoreB += categories[b.category];

        // Score based on price range preference
        if (priceRanges[a.price]) scoreA += priceRanges[a.price];
        if (priceRanges[b.price]) scoreB += priceRanges[b.price];

        return scoreB - scoreA; // Descending order
      });
    }

    // **Properly formatted logging of filtered restaurants**
    console.log("Filtered Restaurants:", filtered);

    return filtered;
  }, [searchTermCategory, searchTermPrice, allRestaurants, preferences]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={fetchRestaurants}>
          <Text style={styles.retryText}>Tap to Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      <InputFilter
        placeholder="Search Categories..."
        initialValue=""
        debounceTime={300}
        onCategoryChange={(text) => setSearchTermCategory(text)}
        onPriceChange={(price) => setSearchTermPrice(price)}
        onReset={handleResetPreferences} // Pass the reset function
      />

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantListItem restaurant={item} />}
        numColumns={1}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No restaurants found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 10,
    // Removed 'gap' as it's not supported in older React Native versions
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
});

export default RestaurantsScreen;
