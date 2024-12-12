// src/components/ReservationsListItem.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { Reservation } from '../types';

interface ReservationsListItemProps {
  reservation: Reservation;
}

const ReservationsListItem: React.FC<ReservationsListItemProps> = ({ reservation }) => {
  return (
    <Link
      href={`/reservations/${reservation.id}`} // Adjust path based on your routing
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
          ⌛ {new Date(reservation.reservation_time).toLocaleString()}
          </Text>
          <Text style={styles.details}>✨ {reservation.status}</Text>
          {reservation.restaurants?.location && (
            <Text style={styles.details}>
              📍 {reservation.restaurants.location} km
            </Text>
          )}
          {reservation.grade !== null && reservation.grade !== undefined && (
            <Text style={styles.gradeText}>Rating: {reservation.grade} ⭐</Text>
          )}
        </View>
      </TouchableOpacity>
    </Link>
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
    padding: 3,
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