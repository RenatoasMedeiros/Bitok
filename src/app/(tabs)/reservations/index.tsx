// src/app/(tabs)/reservations/index.tsx

import React, { useEffect, useState, useMemo } from 'react';
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
import { Reservation } from '../../../types'; 
import ReservationsListItem from '@/components/ReservationsListItem';
import InputFilter from '@/components/InputFilter'; // Import the InputFilter component

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('reservations')
        .select(`*, restaurants(*)`) // Fetch associated restaurant data
        .order('reservation_time', { ascending: true });
      
      console.log('Fetched Reservations:', data);
      if (error) throw error;

      setAllReservations(data || []);
      setReservations(data || []); 
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

  // Filter reservations based on searchTerm
  const filteredReservations = useMemo(() => {
    if (!searchTerm) return reservations;
    
    const lowerSearch = searchTerm.toLowerCase();
    
    return allReservations.filter((res) => {
      const restaurantName = res.restaurants?.name?.toLowerCase() || '';
      const reservationStatus = res.status?.toLowerCase() || '';
      const location = res.restaurants?.location?.toLowerCase() || '';
      // const dateObj = res.reservation_time ? new Date(res.reservation_time) : null;
      // const reservationDate = dateObj ? dateObj.toISOString().slice(8,10).toLowerCase() : '';

  
      return (
        restaurantName.includes(lowerSearch) ||
        reservationStatus.includes(lowerSearch) ||
        // reservationDate.includes(lowerSearch) ||
        location.includes(lowerSearch)
      );
    });
  }, [searchTerm, allReservations, reservations]);
  

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
    <View style={{flex: 1}}>
      {/* Integrate the InputFilter here */}
      <InputFilter
        placeholder="Search Reservations..."
        onFilterChange={(text) => setSearchTerm(text)}
        debounceTime={300}
      />

      <FlatList
        data={filteredReservations}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <ReservationsListItem reservation={item} />}
        numColumns={1}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    gap: 10,
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
