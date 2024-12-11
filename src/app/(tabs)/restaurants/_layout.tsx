import { Stack } from "expo-router";

export default function MenuStack () {
    return (
        <Stack>
            <Stack.Screen name="restaurants" options={{title: 'Menu'}}/>
        </Stack>)
    ;
}