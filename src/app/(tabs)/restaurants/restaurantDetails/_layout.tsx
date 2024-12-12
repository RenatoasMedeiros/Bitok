// /src/app/(tabs)/restaurantDetails/_layout.tsx
import { Stack } from "expo-router";

export default function RestaurantDetailsStack () {
    return (
        <Stack>
            <Stack.Screen name="[detailId]" options={{title: 'Details', headerShown: false}}/>
        </Stack>)
    ;
}