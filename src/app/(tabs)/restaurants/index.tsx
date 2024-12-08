// src/app/(tabs)/restaurants/index.tsx

import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../../../../lib/supabase';
import RestaurantListItem from '../../../components/RestaurantListItem';
import { Restaurant } from '../../../types';

export default function RestaurantsScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from<Restaurant>('restaurants')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      setRestaurants(data || []);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRestaurants();
    setRefreshing(false);
  };

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
    <FlatList
      data={restaurants}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RestaurantListItem restaurant={item} />}
      numColumns={1}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    gap: 10, // Note: 'gap' may not be supported in some React Native versions
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
