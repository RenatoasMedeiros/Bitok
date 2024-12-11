// src/components/ReservationsListItem.tsx

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Reservation } from '../types';
import { Link } from 'expo-router';

type Props = {
  reservation: Reservation;
};

const ReservationsListItem: React.FC<Props> = ({ reservation }) => {
  const { reservation_time, numberGuests, status, restaurants } = reservation;
  const restaurant = restaurants; // Associated restaurant data

  return (
    <Link href={`/(tabs)/reservations/${(reservation.id)}`} asChild>
      <View style={styles.container}>
        {restaurant?.image_url && (
          <Image source={{ uri: restaurant.image_url }} style={styles.image} />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName}>{restaurant?.name}</Text>
          <Text style={styles.details}>
            Time: {new Date(reservation_time).toLocaleString()}
          </Text>
          <Text style={styles.details}>People: {numberGuests}</Text>
          <Text style={styles.details}>{status}</Text>
          {/* Add more restaurant details as needed, e.g., location, distance */}
          {restaurant?.location && (
            <Text style={styles.details}>📍 {restaurant.location}</Text>
          )}
          {/* If you have distance data, include it here */}
        </View>
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.1, // For iOS shadow
    shadowRadius: 4, // For iOS shadow
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
});

export default ReservationsListItem;
