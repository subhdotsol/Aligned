import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import './globals.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "NunitoSans": require("@/assets/fonts/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf"),
    "NunitoSans-Italic": require("@/assets/fonts/NunitoSans-Italic-VariableFont_YTLC,opsz,wdth,wght.ttf"),
    "Tinos": require("@/assets/fonts/Tinos-Regular.ttf"),
    "Tinos-Bold": require("@/assets/fonts/Tinos-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
      </Stack>
    </SafeAreaProvider>
  );
}
