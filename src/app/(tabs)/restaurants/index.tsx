import { View, FlatList } from 'react-native';
import restaurants from '@assets/data/restaurants';
import RestaurantListItem from '@/components/RestaurantListItem';

export default function MenuScreen() {
  return (
      <FlatList 
        data={restaurants}
        renderItem={({item}) => <RestaurantListItem restaurant={item} />}
        numColumns={1}
        contentContainerStyle={{gap:10, padding: 10}}
        //columnWrapperStyle={{gap:10}}
      />
  );
}
