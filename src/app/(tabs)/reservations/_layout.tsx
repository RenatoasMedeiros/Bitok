import { Stack } from "expo-router";

export default function MenuStack () {
    return (
        <Stack>
            <Stack.Screen name="reservations" options={{title: 'Reservations'}}/>
        </Stack>)
    ;
}