import { View, FlatList } from 'react-native';
import products from '@assets/data/products';
import restaurants from '@assets/data/restaurants';
import ProductListItem from '@/components/RestaurantProductListItem';

// To really solve this you need to really stablish an relation ship between product and restaurants!

export default function RestaurantDetailsScreen() {
  return (
      <FlatList 
        data={products, restaurants}
        renderItem={({product, restaurants}) => <ProductListproduct product={product} restaurant={restaurants}/>}
        numColumns={2}
        contentContainerStyle={{gap:10, padding: 10}}
        columnWrapperStyle={{gap:10}}
      />
  );
}
