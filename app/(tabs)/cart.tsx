import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import Banner from "@/components/bussiness/CheckoutBanner";
import {
  Badge,
  Box,
  Button,
  Divider,
  Text
} from "@gluestack-ui/themed";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import {
  HandCoins,
  ShoppingCart
} from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Individual cart item, memoized for performance
import { CartItem } from "@/components/bussiness/CartItem";


export default function Cart() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { user: authUser } = useAuth();
  const { cart, updateCartItem, removeFromCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<boolean[]>(
    cart.map(() => true)
  );

  const handleSelectChange = useCallback((index: number) => {
    setSelectedItems((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  }, []);

  // Performant totals
  const afterDiscAmount = useMemo(
    () =>
      cart.reduce(
        (acc, item, i) =>
          selectedItems[i] ? acc + item.calculated_price * item.quantity : acc,
        0
      ),
    [cart, selectedItems]
  );
  const totalAmount = useMemo(
    () =>
      cart.reduce(
        (acc, item, i) =>
          selectedItems[i] ? acc + Number(item.price) * item.quantity : acc,
        0
      ),
    [cart, selectedItems]
  );
  const isDisabled =
    afterDiscAmount === 0 ||
    cart.length === 0 ||
    !authUser?.is_logged_in ||
    !authUser?.is_profile_completed;

  return (
    <Box flex={1} backgroundColor="#f9fafb">
      {cart.length === 0 ? (
        // Empty State
        <Box flex={1} alignItems="center" justifyContent="center" padding={22}>
          <ShoppingCart size={66} color="#9ca3af" />
          <Text fontSize={22} fontWeight="700" marginTop={14}>
            Your cart is empty
          </Text>
          <Text fontSize={15} color="#6b7280" marginTop={5} textAlign="center">
            Looks like you haven’t added anything yet.{"\n"}
            Go ahead and explore products!
          </Text>
        </Box>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              padding: 12,
              paddingBottom: insets.bottom + tabBarHeight + 195,
            }}
            showsVerticalScrollIndicator={false}
            decelerationRate="normal"
            scrollEventThrottle={16}
          >
            <Box >
              {cart.map((item, i) => (
                <CartItem
                  key={String(item.product_id) + "-" + String(i)}
                  item={item}
                  i={i}
                  selected={selectedItems[i]}
                  onSelect={handleSelectChange}
                  updateCartItem={updateCartItem}
                  removeFromCart={removeFromCart}
                />
              ))}
            </Box>
            {/* Invoice Summary */}
            <Box
              marginTop={24}
              padding={18}
              borderRadius={8}
              backgroundColor="#fff"
              shadowColor="#000"
              shadowOpacity={0.07}
              shadowRadius={10}
              shadowOffset={{ width: 0, height: 4 }}
              elevation={2}
            >
              <Box flexDirection="row" justifyContent="space-between" marginBottom={6}>
                <Text fontWeight="600">Subtotal</Text>
                <Text>₹{afterDiscAmount.toFixed(2)}</Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between">
                <Text>Shipping</Text>
                <Text color="#22c55e">Free</Text>
              </Box>
              <Divider marginVertical={9} />
              <Box flexDirection="row" justifyContent="space-between">
                <Text>You saved</Text>
                <Badge
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 7,
                    backgroundColor: "#22c55e1a",
                  }}
                >
                  <Box flexDirection="row" alignItems="center" gap={4}>
                    <HandCoins size={14} color="#22c55e" />
                    <Text color="#22c55e" fontWeight="600">
                      ₹{(totalAmount - afterDiscAmount).toFixed(2)}
                    </Text>
                  </Box>
                </Badge>
              </Box>
              <Divider marginVertical={9} />
              <Box flexDirection="row" justifyContent="space-between" marginTop={6}>
                <Text fontWeight="700" fontSize={17}>
                  Total
                </Text>
                <Text fontWeight="700" fontSize={17}>
                  ₹{afterDiscAmount.toFixed(2)}
                </Text>
              </Box>
              {!authUser?.is_logged_in ? (
                <Banner
                  title="Login Required"
                  description="You need to log in to place an order."
                  linkText="Login Now"
                  onClick={() => router.push("/login")}
                />
              ) : !authUser.is_profile_completed ? (
                <Banner />
              ) : null}
            </Box>
          </ScrollView>
          {/* Sticky Bottom Checkout Bar */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            backgroundColor="#fff"
            paddingHorizontal={18}
            paddingTop={14}
            paddingBottom={insets.bottom + tabBarHeight + 18}
            borderTopWidth={1}
            borderColor="#e5e7eb"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            shadowColor="#000"
            shadowOpacity={0.04}
            shadowRadius={8}
            elevation={5}
          >
            {/* Total Section */}
            <Box flexDirection="column">
              <Text fontSize={15} color="#6b7280">
                Total
              </Text>
              <Text fontWeight="700" fontSize={19} color="#111827">
                ₹{afterDiscAmount.toFixed(2)}
              </Text>
            </Box>
            {/* Place Order Button */}
            <Button
              disabled={isDisabled}
              onPress={() => {}}
              style={[
                styles.checkoutBtn,
                {
                  backgroundColor: isDisabled ? "#9ca3af" : "#2563eb",
                },
              ]}
            >
              <Text color="#fff" fontWeight="700" fontSize={17}>
                Place Order
              </Text>
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    marginVertical: 3,
    marginHorizontal: 2,
  },
  cartImage: {
    width: 84,
    height: 84,
    borderRadius: 11,
    backgroundColor: "#f3f4f6",
    marginRight: 10,
  },
  cartDesc: {
    gap: 4,
    minHeight: 70,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutBtn: {
    marginLeft: 16,
    flex: 1,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 200,
  },
});
