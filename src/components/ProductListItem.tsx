import { StyleSheet, Image, Pressable } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Product } from '../types';
import { Link } from 'expo-router';

export const defaultPizzaImage = 
'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/peperoni.png';

type ProductListItemProps = {
    product: Product;
}
const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    // Since we are wrapping all the components we need to pass asChild so it maintain the original styles
    // The link require a child with a onPress Event! thats why i replaced the View with the Pressable 
    // the way to pass Dynamic properties is like the code bellow -> (`/${product.id}`)
    <Link href={`/menu/${(product.id)}`} asChild>
      <Pressable style={styles.container}>
        {/* Since the image always try to fill 100% of the space, we may lost some part of the images.. so resizeMode='contain' will prevent that! */}
        <Image source={{uri: product.image || defaultPizzaImage}} style={styles.image} resizeMode='contain' />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{product.price}€</Text>
      </Pressable>
    </Link>
  )
}

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
