// src/app/(tabs)/reservations/[id].tsx

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../../lib/supabase';
import { Reservation } from '../../../types';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ReservationDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [grade, setGrade] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reservation details
  const fetchReservation = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from<Reservation>('reservations')
        .select(`*, restaurants(*)`)
        .eq('id', id)
        .single();

      if (error) throw error;

      setReservation(data);
      setGrade(data.grade ?? null);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservation();
  }, [id]);

  // Handle deletion of reservation
  const handleDelete = () => {
    Alert.alert(
      'Delete Reservation',
      'Are you sure you want to delete this reservation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('reservations')
                .delete()
                .eq('id', id);

              if (error) throw error;

              Alert.alert('Success', 'Reservation deleted successfully.');
              router.back();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete reservation.');
            }
          },
        },
      ]
    );
  };

  // Handle submission of grade
  const handleSubmitGrade = async () => {
    if (grade === null) {
      Alert.alert('Validation', 'Please select a grade before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('reservations')
        .update({ grade })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Success', 'Grade submitted successfully.');
      fetchReservation(); // Refresh data to show updated grade
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit grade.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render star icons for grading
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setGrade(i)}
          activeOpacity={0.7}
        >
          <Text style={styles.star}>{i <= (grade || 0) ? '⭐' : '☆'}</Text>
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !reservation) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Error: {error || 'Reservation not found.'}</Text>
        <TouchableOpacity onPress={fetchReservation} style={styles.retryButton}>
          <Text style={styles.retryText}>Tap to Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { restaurants, reservation_time, numberGuests, status, grade: existingGrade } = reservation;
  const restaurant = restaurants;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Reservation and Restaurant Details */}
        <View style={styles.card}>
          <Text style={styles.restaurantName}>{restaurant?.name}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>
              🕓{new Date(reservation_time).toLocaleString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>🫂 {numberGuests} Guests</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>✅ {status}</Text>
          </View>
          {restaurant?.location && (
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>📍 {restaurant.location}</Text>
            </View>
          )}
        </View>

        {/* Grade Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rate the Restaurant:</Text>
          {renderStars()}
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting ? styles.buttonDisabled : styles.buttonEnabled,
            ]}
            onPress={handleSubmitGrade}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </Text>
          </TouchableOpacity>
          {existingGrade !== null && existingGrade !== undefined && (
            <Text style={styles.existingGradeText}>Your Rating: {existingGrade} 🌟</Text>
          )}
        </View>

        {/* Delete Button */}
        <View style={styles.deleteSection}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete Reservation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40, // Extra padding at bottom
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
  retryButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  retryText: {
    color: '#333',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starTouchable: {
    marginHorizontal: 4,
  },
  star: {
    fontSize: 48,
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonEnabled: {
    backgroundColor: '#007AFF', // iOS blue
  },
  buttonDisabled: {
    backgroundColor: '#a0cfff',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  existingGradeText: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  deleteSection: {
    alignItems: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ReservationDetailScreen;
