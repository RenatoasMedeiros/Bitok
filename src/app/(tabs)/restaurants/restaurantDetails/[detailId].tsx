import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../../../../lib/supabase"; // Adjust the path based on your project structure
import ProductListItem from "@/components/RestaurantProductListItem";
import CallRestaurantButton from "@/components/CallRestaurantButton";
import { Product, Restaurant } from "@/types";

const RestaurantDetails = () => {
  const { detailId } = useLocalSearchParams(); // Get the restaurant ID from the route
  const restaurantId = detailId as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch Restaurant Details and Products
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch Restaurant Details
      const { data: restaurantData, error: restaurantError } = await supabase
        .from<Restaurant>("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .single();

      if (restaurantError) {
        throw restaurantError;
      }

      setRestaurant(restaurantData);

      // Fetch Products Associated with the Restaurant
      const { data: productsData, error: productsError } = await supabase
        .from<Product>("products")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("name", { ascending: true });

      if (productsError) {
        throw productsError;
      }

      setProducts(productsData || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Handler for the "Call Me" button
  const handleCallPress = () => {
    if (restaurant) {
      Alert.alert(
        "Call Restaurant",
        `Calling ${restaurant.name} at ${restaurant.contact}...`
      );
      // Implement actual call functionality here using Linking API or appropriate library
    }
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
        <TouchableOpacity onPress={fetchData}>
          <Text style={styles.retryText}>Tap to Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text>Restaurant not found :(</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Restaurant Header */}
      <View style={styles.header}>
        <Image source={{ uri: restaurant.image_url }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.price}>{restaurant.price}</Text>
          <Text style={styles.location}>📍 {restaurant.location} km</Text>
          <Text style={styles.evaluation}>⭐ {restaurant.evaluation}</Text>
        </View>
      </View>

      {/* Call Button */}
      <CallRestaurantButton onPress={handleCallPress} phoneNumber={restaurant.contact} restaurantId={restaurant.id}/>

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductListItem product={item} restaurant={restaurant} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products available.</Text>
        }
      />
    </View>
  );
};

export default RestaurantDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  evaluation: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  listContainer: {
    padding: 10,
    // gap is not supported in older React Native versions
    // Using margin instead
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  retryText: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
    fontSize: 16,
  },
});
