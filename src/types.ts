import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";

export type Restaurant = {
  id: string;
  user_id: string;
  name: string;
  image_url?: string;
  price: string; //'€' | '€€' | '€€€';
  location: string;
  evaluation: number;
  contact: string;
};

export type Product = {
  id: string;
  restaurant_id: string
  name: string;
  image_url?: string;
  price: number;
};

export type Reservation = {
  id: string;
  user_id: string;
  restaurant_id: string;
  reservation_time: Date;
  numberGuests: number; //'€' | '€€' | '€€€';
  status: string;
  grade?: number;
  restaurants?: Restaurant;
};

export type PizzaSize = 'S' | 'M' | 'L' | 'XL';

export type Profile = {
  id: string;
  group: string;
};
