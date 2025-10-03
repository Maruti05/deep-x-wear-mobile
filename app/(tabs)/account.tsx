import { Box, HStack, Text, VStack } from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import { LogOut, Settings, ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const { user: authUser, logout } = useAuth(); // no fallback
  const router = useRouter();

  // useEffect(() => {
  //   if (!authUser) {
  //     router.push('/login');
  //   }
  // }, [authUser, router]);

  if (!authUser) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" padding={24}>
        <Text fontSize={20} fontWeight="bold" marginBottom={16}>
          Welcome!
        </Text>
        <Text fontSize={14} color="#6B7280" textAlign="center" marginBottom={24}>
          Please login to access your account details
        </Text>
        <Pressable
          style={{
            backgroundColor: '#111827',
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 32,
          }}
          onPress={() => router.push('/login')}
        >
          <Text fontSize={16} fontWeight="bold" color="white">
            Login
          </Text>
        </Pressable>
      </Box>
    );
  }

  return (
    <View style={{ padding: 24 }}>
      <Box marginBottom={32}>
        <Text fontSize={20} fontWeight="bold">
          Hello, {authUser?.display_name ?? 'User'}!
        </Text>
        <Text fontSize={14} color="#6B7280" marginTop={2}>
          Welcome back to your account
        </Text>
      </Box>

      <VStack style={{ gap: 16 }}>
        {/* Profile Option */}
        <Pressable
          style={{
            backgroundColor: '#F3F4F6',
            borderRadius: 12,
            padding: 16,
          }}
          onPress={() => router.push('/profile')}
        >
          <HStack alignItems="center" justifyContent="flex-start" style={{ gap: 12 }}>
            <Settings size={24} color="#111827" />
            <Text fontSize={16} fontWeight="600">Profile Settings</Text>
          </HStack>
        </Pressable>

        {/* My Orders */}
        <Pressable
          style={{
            backgroundColor: '#F3F4F6',
            borderRadius: 12,
            padding: 16,
          }}
          onPress={() => router.push('/orders')}
        >
          <HStack alignItems="center" justifyContent="flex-start" style={{ gap: 12 }}>
            <ShoppingBag size={24} color="#111827" />
            <Text fontSize={16} fontWeight="600">My Orders</Text>
          </HStack>
        </Pressable>

        {/* Logout */}
        <Pressable
          style={{
            backgroundColor: '#EF4444',
            borderRadius: 12,
            padding: 16,
          }}
          onPress={() => logout?.()}
        >
          <HStack alignItems="center" justifyContent="center" style={{ gap: 12 }}>
            <LogOut size={24} color="white" />
            <Text fontSize={16} fontWeight="600" color="white">
              Logout
            </Text>
          </HStack>
        </Pressable>
      </VStack>
    </View>
  );
};

export default Account
