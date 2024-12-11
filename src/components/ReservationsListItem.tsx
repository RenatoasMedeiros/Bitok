import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { Reservation } from '../types';

const ReservationsListItem: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Fetch the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        fetchReservations(session.user.id); // Fetch reservations for the logged-in user
      } else {
        router.push('/(tabs)/authRoute'); // Redirect if no session
      }
    });
  
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setSession(session);
          fetchReservations(session.user.id); // Fetch reservations for the logged-in user
        } else {
          router.push('/(tabs)/authRoute'); // Redirect if no session
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
      const { data, error } = await supabase
        .from('reservations')
        .select('*, restaurants(*)') // Adjust columns based on your database schema
        .eq('user_id', userId); // Filter reservations by user_id

      if (error) {
        console.error('Error fetching reservations:', error);
      } else {
        setReservations(data || []);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  if (!session) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      {reservations.map((reservation) => (
        <Link
          key={reservation.id}
          href={`/(tabs)/reservations/${reservation.id}`}
          asChild
        >
          <TouchableOpacity style={styles.container}>
            {reservation.restaurants?.image_url && (
              <Image
                source={{ uri: reservation.restaurants.image_url }}
                style={styles.image}
              />
            )}
            <View style={styles.infoContainer}>
              <Text style={styles.restaurantName}>
                {reservation.restaurants?.name}
              </Text>
              <Text style={styles.details}>
                Time: {new Date(reservation.reservation_time).toLocaleString()}
              </Text>
              <Text style={styles.details}>People: {reservation.numberGuests}</Text>
              <Text style={styles.details}>{reservation.status}</Text>
              {reservation.restaurants?.location && (
                <Text style={styles.details}>
                  📍 {reservation.restaurants.location}
                </Text>
              )}
              {reservation.grade !== null && reservation.grade !== undefined && (
                <Text style={styles.gradeText}>Rating: {reservation.grade} ⭐</Text>
              )}
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  gradeText: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
});

export default ReservationsListItem;
