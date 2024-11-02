import { StyleSheet, Image } from 'react-native';

import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';

const ProductListItem = ({ product }) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: product.image}} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>{product.price}€</Text>
    </View>
  )
}

export default ProductListItem //this is needed to really be able to export our component!

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black', //change to white in the white mode!
    padding: 10,
    borderRadius: 20,
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
