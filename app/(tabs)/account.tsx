import { Box, HStack, Image, Pressable, SafeAreaView, Text, VStack } from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import { ChevronRight, LogOut, Settings, ShoppingBag, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const CARD_MARGIN_TOP = 16;

const Account = () => {
  const { user: authUser, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('account'); // 'account' or 'wishlist'

  if (!authUser) {
  return (
    <Box flex={1} justifyContent="center" alignItems="center" style={styles.bgGray}>
      <Box alignItems="center" width="100%">
        <Box style={styles.iconCircle}>
          <User size={36} color="#111827" />
        </Box>
        <Text fontSize={24} fontWeight="bold" marginTop={20} color="#111827">
          Welcome!
        </Text>
        <Text
          fontSize={16}
          color="#6B7280"
          textAlign="center"
          marginTop={12}
          marginBottom={32}
          style={{ maxWidth: 300 }}
        >
          Please login to access your account details and a more personalized experience.
        </Text>
        <Pressable
          style={styles.loginButtonBlack}
          onPress={() => router.push('/login')}
        >
          <Text fontSize={16} fontWeight="bold" color="white">
            Login
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
}


  return (
    <SafeAreaView flex={1}>
    <Box flex={1} style={styles.bgGray}>
      {/* Profile section */}
      <Box alignItems="center" justifyContent="center" paddingVertical={32} backgroundColor="white">
        <Image
          source={{ uri: 'https://dummyimage.com/100x100/eee/222' }}
          style={styles.avatar}
        />
        <Text fontSize={18} fontWeight="bold">{authUser.display_name ?? 'User'}</Text>
        <Text fontSize={14} color="#6B7280">{authUser.email ?? 'Your email'}</Text>
        <Pressable onPress={() => router.push('/profile/edit')} style={styles.editIcon}>
          <User size={20} />
        </Pressable>
      </Box>

      {/* Tabs */}
      <HStack backgroundColor="white" justifyContent="center" style={styles.tabBar}>
        <Pressable onPress={() => setTab('account')}>
          <Box
            paddingVertical={12}
            paddingHorizontal={28}
            style={tab === 'account' ? styles.activeTab : null}
          >
            <Text color={tab === 'account' ? "#0EA5E9" : "#aaa"} fontWeight="bold">Account</Text>
          </Box>
        </Pressable>
        <Pressable onPress={() => setTab('wishlist')}>
          <Box
            paddingVertical={12}
            paddingHorizontal={28}
            style={tab === 'wishlist' ? styles.activeTab : null}
          >
            <Text color={tab === 'wishlist' ? "#0EA5E9" : "#aaa"} fontWeight="bold">Wishlist</Text>
          </Box>
        </Pressable>
      </HStack>

      {/* Main Content */}
      {tab === 'account' ? (
        <VStack padding={24}>
          {/* One unified card for all menus */}
          <Box style={styles.menuCard}>
            <Pressable onPress={() => router.push('/purchase-history')}>
              <HStack alignItems="center" justifyContent="space-between" style={styles.menuRow}>
                <HStack alignItems="flex-start" flexDirection="row">
                  <ShoppingBag color="#0EA5E9" size={22} />
                  <Text style={styles.hstackText} fontSize={16} fontWeight="600">Purchase History</Text>
                </HStack>
                <ChevronRight color="#bbb" size={20} />
              </HStack>
            </Pressable>

            <Box style={styles.divider} />

            <Pressable onPress={() => router.push('/profile')}>
              <HStack alignItems="center" justifyContent="space-between" style={styles.menuRow}>
                <HStack alignItems="flex-start" flexDirection="row">
                  <User color="#0EA5E9" size={22} />
                  <Text style={styles.hstackText} fontSize={16} fontWeight="600">Profile</Text>
                </HStack>
                <ChevronRight color="#bbb" size={20} />
              </HStack>
            </Pressable>

            <Box style={styles.divider} />

            <Pressable onPress={() => router.push('/settings')}>
              <HStack alignItems="center" justifyContent="space-between" style={styles.menuRow}>
                <HStack alignItems="flex-start" flexDirection="row">
                  <Settings color="#0EA5E9" size={22} />
                  <Text style={styles.hstackText} fontSize={16} fontWeight="600">Settings</Text>
                </HStack>
                <ChevronRight color="#bbb" size={20} />
              </HStack>
            </Pressable>
          </Box>

          <Pressable onPress={logout}>
            <Box style={[styles.logoutCard, { marginTop: CARD_MARGIN_TOP }]} flexDirection="row" alignItems="center" justifyContent="center">
              <LogOut size={22} color="white" />
              <Text fontSize={16} fontWeight="600" color="white" style={{ marginLeft: 10 }}>Log Out</Text>
            </Box>
          </Pressable>
        </VStack>
      ) : (
        <VStack padding={24}>
          <Box style={styles.card} alignItems="flex-start" width="100%">
            <Text fontSize={16} fontWeight="600">Cozy Low Chair</Text>
            <Text fontSize={14} color="#6B7280">$135.00 × 1</Text>
          </Box>
          <Box style={[styles.card, { marginTop: CARD_MARGIN_TOP }]} alignItems="flex-start" width="100%">
            <Text fontSize={16} fontWeight="600">Suede Dinning Chair</Text>
            <Text fontSize={14} color="#6B7280">$129.00 × 1</Text>
          </Box>
          <Box style={[styles.card, { marginTop: CARD_MARGIN_TOP }]} alignItems="flex-start" width="100%">
            <Text fontSize={16} fontWeight="600">Silver Sweet Lamp</Text>
            <Text fontSize={14} color="#6B7280">$99.00 × 2</Text>
          </Box>
          <Box style={[styles.card, { marginTop: CARD_MARGIN_TOP }]} alignItems="flex-start" width="100%">
            <Text fontSize={16} fontWeight="600">Simple Wooden Table</Text>
            <Text fontSize={14} color="#6B7280">$120.00 × 1</Text>
          </Box>
        </VStack>
      )}
    </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bgGray: {
    backgroundColor: '#f6f7fb',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  editIcon: {
    position: 'absolute',
    top: 16,
    right: 24,
  },
  tabBar: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#0EA5E9',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 4,
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  menuRow: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
  },
  hstackText: {
    marginLeft: 14,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    marginHorizontal: 18,
  },
  logoutCard: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    padding: 18,
  },
  loginButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  iconCircle: {
    backgroundColor: '#e5e7eb',
    borderRadius: 50,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonBlack: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  }
});

export default Account;
