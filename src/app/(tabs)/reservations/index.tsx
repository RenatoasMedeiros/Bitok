// src/app/(tabs)/reservations/index.tsx

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
import { Reservation } from '../../../types'; // Import the updated Reservation type
import ReservationsListItem from '@/components/ReservationsListItem';

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from<Reservation>('reservations')
        .select(`*, restaurants(*)`) // Fetch associated restaurant data
        .order('reservation_time', { ascending: true });

      if (error) throw error;

      setReservations(data || []); // Set to reservations
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReservations();
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
        <TouchableOpacity onPress={fetchReservations}>
          <Text style={styles.retryText}>Tap to Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={reservations}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => <ReservationsListItem reservation={item} />}
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
