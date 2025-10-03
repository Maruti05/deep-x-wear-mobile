/* eslint-disable import/first */
import "react-native-gesture-handler";
/* eslint-enable import/first */
import "@/global.css";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
         <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f7fb" }} edges={['top', 'left', 'right']}>
        <GluestackUIProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <AuthProvider>
              <CartProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="product/[id]" />
                  <Stack.Screen name="signup" />
                  <Stack.Screen name="login" />
                  <Stack.Screen name="profile" />
                  <Stack.Screen name="orders" />
                </Stack>
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </GluestackUIProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
