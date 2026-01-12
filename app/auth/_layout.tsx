import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="phone" />
            <Stack.Screen name="verify" />
            <Stack.Screen name="interstitial" options={{ animation: 'fade' }} />
            <Stack.Screen name="name" />
        </Stack>
    );
}
