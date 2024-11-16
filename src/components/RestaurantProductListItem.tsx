import { FlatList, StyleSheet, Image, Pressable } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Product, Restaurant } from '../types';
import { Link } from 'expo-router';

export const defaultPizzaImage = 
'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/peperoni.png';

type RestaurantProductListItemProps = {
    product: Product;
    restaurant: Restaurant;
}

const ProductListItem = ({ product, restaurant }: RestaurantProductListItemProps) => {
  const item = product || restaurant;

  return (
    <Link href={`/restaurantDetails/${restaurant.id}/productDetails/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <Image
          source={{ uri: item.image || defaultPizzaImage }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{item.name}</Text>
        {product && <Text style={styles.price}>{product.price}€</Text>}
      </Pressable>
    </Link>
  );
};

export default ProductListItem //this is needed to really be able to export our component!

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white', //change to white in the white mode!
    padding: 10,
    borderRadius: 20,
    flex: 1, //split equally the space!
    maxWidth: '50%' //since we can have even products! and it should slit in 2 columns
  },
  title: {
    fontSize: 18, 
    fontWeight: '600',
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    aspectRatio: 1, //the height will be automatically calculated! :) 
  }
});
