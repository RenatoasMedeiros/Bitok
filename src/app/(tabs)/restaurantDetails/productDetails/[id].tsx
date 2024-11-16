import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import products from '@assets/data/products';
import { defaultPizzaImage } from '@/components/RestaurantProductListItem';
import { useState } from 'react'; //to keep tracking of the state
import Button from '@/components/button';
import restaurants from '@assets/data/restaurants';

// we name this [id].tsx because it is a dynamic property that we are receiving 

const sizes = ['S', 'M', 'L', 'XL'];

const RestaurantProductsDetails = () => {
  const { id } = useLocalSearchParams();

  //Code for states! (should be declared inside of the component)
  const [selectedSize, setSelectedSize] = useState('M');

  const addToCart = () => {
    console.warn('Adding to cart, size', selectedSize)
  }

  const restaurant = restaurants.find((p) => p.id.toString() === id)
  if(!restaurant) {
    return <Text>Restaurant not found :(</Text>;
  }

  const product = products.find((p) => p.id.toString() === id)
  if(!product) {
    return <Text>Product not found :(</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: restaurant?.name }} />
        <Link href={`/restaurantDetails/${(restaurant.id)}/productDetails/${product.id}`} asChild>
          <Pressable>
            <View style={styles.restaurantContact}>
              {/* to ensure that will have 1 decimal point! */}
              <Text style={styles.restaurantContactText}>{restaurant.contact}</Text>
            </View>
          </Pressable>
        </Link>
      <Image source={{ uri: product.image || defaultPizzaImage }} style={styles.image}/>

      <Text>Select size</Text>
        <View style={styles.sizes}>
          {sizes.map(size => (
            //the key is needed for react optimization
            <Pressable onPress={() => {setSelectedSize(size)}} style={[styles.size, 
                  {
                    backgroundColor: selectedSize === size ? 'gainsboro' : 'white',
                  }
                ]} 
                key={size}> 
              <Text style={[styles.sizeText, 
                {
                  color: selectedSize === size ? 'black' : 'gray'
                }
                ]}>{size}
              </Text> 
            </Pressable>
          ))}
        </View>
      <Text style={styles.price}>{product.price}€</Text>
      <Button onPress={addToCart} text="Add to cart"></Button>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  price: {
    fontSize: 18, 
    fontWeight: 'bold',
    marginTop: 'auto',
  },
  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  size: {
    backgroundColor: 'gainsboro',  //a very lightgrey fits better 
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500',
  },
  restaurantContact: {
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    padding: 25,
    marginHorizontal: 15,
    marginVertical: 15,
  },
  restaurantContactText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  }
})
export default RestaurantProductsDetails