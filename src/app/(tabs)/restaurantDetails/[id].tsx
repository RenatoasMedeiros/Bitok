import { View, FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import products from '@assets/data/products';
import restaurants from '@assets/data/restaurants';
import ProductListItem from '@/components/RestaurantProductListItem';
import CallRestaurantButton from '@/components/CallRestaurantButton';

const RestaurantDetails = () => {
  const { id } = useLocalSearchParams(); // Get the restaurant ID from the route

  // Find the restaurant by ID
  const restaurant = restaurants.find((r) => r.id.toString() === id);

  // If the restaurant isn't found, show an error message
  if (!restaurant) {
    return <Text>Restaurant not found :(</Text>;
  }
  // Handler for the "Call Me" button
  const handleCallPress = () => {
    console.warn(`Calling ${restaurant.name}...`);
  };
  // Render all products and pass them to ProductListItem
  return (
    <View>
      <CallRestaurantButton onPress={handleCallPress} phoneNumber={restaurant.contact} />
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductListItem product={item} restaurant={restaurant} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
      />
    </View>
  );
};

export default RestaurantDetails;
