import { StyleSheet, Image, Pressable } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { supabase } from '../../lib/supabase'
import Auth from '@/app/(tabs)/account'
import Account from '@/components/Account'
import { Restaurant } from '../types';
import { Session } from '@supabase/supabase-js'
import { Link } from 'expo-router';

export const defaultPizzaImage = 
'https://ubrntyhmzwnuxfxwrvsn.supabase.co/storage/v1/object/public/product-images/6cheese.png?t=2024-12-07T09%3A10%3A06.266Z';

type RestaurantListItemProps = {
    restaurant: Restaurant;
}
const RestaurantListItem = ({ restaurant }: RestaurantListItemProps) => {

  // const getColor = (evaluation: number) => {
  //   if (evaluation <= 1) return '#FF4D4D'; // Red for low evaluation
  //   if (evaluation <= 3) return '#FFC107'; // Yellow for medium evaluation
  //   return '#4CAF50'; // Green for high evaluation
  // };
  // Function to interpolate color based on evaluation
const getColor = (evaluation: number): string => {
  if (evaluation <= 2.5) {
    // Transition from red (255, 0, 0) to yellow (255, 255, 0)
    const green = Math.round((evaluation / 2.5) * 255);
    return `rgb(255,${green},0)`;
  } else {
    // Transition from yellow (255, 255, 0) to green (0, 255, 0)
    const red = Math.round((1 - (evaluation - 2.5) / 2.5) * 255);
    return `rgb(${red},255,0)`;
  }
};

  return (
    // Since we are wrapping all the components we need to pass asChild so it maintain the original styles
    // The link require a child with a onPress Event! thats why i replaced the View with the Pressable 
    // the way to pass Dynamic properties is like the code bellow -> (`/${product.id}`)
    <Link href={`/(tabs)/restaurants/restaurantDetails/${(restaurant.id)}`} asChild>
      <Pressable style={styles.container}>
        <View>
          {/* Since the image always try to fill 100% of the space, we may lost some part of the images.. so resizeMode='contain' will prevent that! */}
          {/* <Image source={{uri: restaurant.image || defaultPizzaImage}} style={styles.image} resizeMode='contain' /> */}
          <Text style={styles.title}>{restaurant.name}</Text>
          <Text style={styles.info}>Aberto - xKM</Text>
        </View>
        {/* Evaluation square */}
        <View
          style={[
            styles.evaluationContainer,
            {
              backgroundColor: getColor(restaurant.evaluation),
            },
          ]}
        >
          {/* to ensure that will have 1 decimal point! */}
          <Text style={styles.evaluationText}>{restaurant.evaluation.toFixed(1)}</Text>
        </View>
      </Pressable>
    </Link>
  )
}

export default RestaurantListItem //this is needed to really be able to export our component!

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white', //change to white in the white mode!
    padding: 30,
    borderRadius: 20,
    flex: 1, //split equally the space!
    maxWidth: '100%', //since we can have even products! and it should slit in 2 columns
    flexDirection: 'row', // Layout children in a row
    alignItems: 'center', // Center vertically
    justifyContent: 'space-between', // Space between details and evaluation
    marginBottom: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22, 
    fontWeight: '600',
    marginVertical: 10,
    marginLeft: 5,
  },
  info: {
    fontSize: 18, 
    marginLeft: 5,
    paddingBottom: 5
  },
  // price: {
  //   color: Colors.light.tint,
  //   fontWeight: 'bold'
  // },
  image: {
    width: '100%',
    aspectRatio: 1, //the height will be automatically calculated! :) 
  },
  evaluationContainer: {
    width: 40,
    height: 40,
    borderRadius: 8, // Rounded corners
    transform: [{ rotate: '45deg' }], // Rotate the square
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 25,
  },
  evaluationText: {
    transform: [{ rotate: '-45deg' }], // Rotate text back to normal
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
