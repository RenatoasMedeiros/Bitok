import { View, FlatList } from 'react-native';
import products from '@assets/data/products';
import ProductListItem from '@/components/RestaurantProductListItem';

export default function RestaurantDetailsScreen({ route }) {
  const { restaurant } = route.params; // Get the restaurant details from navigation

  return (
    <FlatList
      data={products} // Show all products
      renderItem={({ item }) => (
        <ProductListItem product={item} restaurant={restaurant} />
      )}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}
