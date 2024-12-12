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
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';

export default function ReservationsScreen() {
  const [allReservations, setAllReservations] = useState<Reservation[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [session, setSession] = useState<Session | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Fetch the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        fetchReservations(session.user.id); // Fetch reservations for the logged-in user
      } else {
        router.push('/(tabs)/account'); // Redirect if no session
      }
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setSession(session);
          fetchReservations(session.user.id); // Fetch reservations for the logged-in user
        } else {
          router.push('/account'); // Redirect if no session
        }
      }
    );

    // Unsubscribe on cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchReservations = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('reservations')
        .select(`*, restaurants(*)`) // Fetch associated restaurant data
        .eq('user_id', userId) // Filter reservations by user_id
        .order('reservation_time', { ascending: true });
      
      console.log('Fetched Reservations:', data);
      if (error) throw error;

      setAllReservations(data || []); 
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (session) {
      setRefreshing(true);
      await fetchReservations(session.user.id);
      setRefreshing(false);
    }
  };

  // Filter reservations based on searchTerm
  const filteredReservations = useMemo(() => {
    if (!searchTerm) return allReservations;
    
    const lowerSearch = searchTerm.toLowerCase();
    
    return allReservations.filter((res) => {
      const restaurantName = res.restaurants?.name?.toLowerCase() || '';
      const reservationStatus = res.status?.toLowerCase() || '';
      const location = res.restaurants?.location?.toLowerCase() || '';

      return (
        restaurantName.includes(lowerSearch) ||
        reservationStatus.includes(lowerSearch) ||
        location.includes(lowerSearch)
      );
    });
  }, [searchTerm, allReservations]);

  if (!session) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
        <TouchableOpacity onPress={() => fetchReservations(session.user.id)}>
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reservations found.</Text>
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
    fontSize: 16,
  },
});
