import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import './globals.css';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "NunitoSans": require("@/assets/fonts/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf"),
    "NunitoSans-Italic": require("@/assets/fonts/NunitoSans-Italic-VariableFont_YTLC,opsz,wdth,wght.ttf"),
    "Tinos": require("@/assets/fonts/Tinos-Regular.ttf"),
    "Tinos-Bold": require("@/assets/fonts/Tinos-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
