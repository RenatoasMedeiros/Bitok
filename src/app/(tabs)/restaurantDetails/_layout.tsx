import { Stack } from "expo-router";

export default function RestaurantDetailsStack () {
    return (
        <Stack>
            <Stack.Screen name="index" options={{title: 'Details'}}/>
        </Stack>)
    ;
}