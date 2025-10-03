import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React from "react";

// Lucide icons
import { Grid, Home, ShoppingCart, User } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

    <Tabs
      screenOptions={{
    headerShown: false,
    tabBarStyle: {
      position: "absolute",
      bottom: 10,
      left: 16,
      right: 16,
      borderRadius: 16,
      height: 60,
      backgroundColor: "rgba(255,255,255,0.95)",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      marginHorizontal: 10,
    },
    tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
    tabBarButton: HapticTab,
  }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: "Category",
          tabBarIcon: ({ color }) => <Grid size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
