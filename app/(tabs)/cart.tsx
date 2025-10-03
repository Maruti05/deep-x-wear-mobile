import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import Banner from "@/components/bussiness/CheckoutBanner";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Text,
} from "@gluestack-ui/themed";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  HandCoins,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDiscountedPrice } from "../lib/utils";

export default function Cart() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight(); // 👈 tab bar height
  const { user: authUser } = useAuth();
  const { cart, updateCartItem, removeFromCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<boolean[]>(
    cart.map(() => true)
  );

  const handleSelectChange = (index: number) => {
    const updated = [...selectedItems];
    updated[index] = !updated[index];
    setSelectedItems(updated);
  };

  // Totals
  const afterDiscAmount = cart.reduce(
    (acc, item, i) =>
      selectedItems[i] ? acc + item.calculated_price * item.quantity : acc,
    0
  );
  const totalAmount = cart.reduce(
    (acc, item, i) =>
      selectedItems[i] ? acc + Number(item.price) * item.quantity : acc,
    0
  );

  const isDisabled =
    afterDiscAmount === 0 ||
    cart.length === 0 ||
    !authUser?.is_logged_in ||
    !authUser?.is_profile_completed;

  return (
    <Box flex={1} backgroundColor="#f9fafb">
      {cart.length === 0 ? (
        // 🛒 Empty State
        <Box flex={1} alignItems="center" justifyContent="center" padding={20}>
          <ShoppingCart size={64} color="#9ca3af" />
          <Text fontSize={20} fontWeight="700" marginTop={12}>
            Your cart is empty
          </Text>
          <Text fontSize={14} color="#6b7280" marginTop={4} textAlign="center">
            Looks like you haven’t added anything yet.{"\n"}
            Go ahead and explore products!
          </Text>
        </Box>
      ) : (
        <>
          {/* Scrollable Cart Items + Summary */}
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              // add extra padding so last item isn't hidden by sticky bar
              paddingBottom: insets.bottom + tabBarHeight + 200,
            }}
            showsVerticalScrollIndicator={false} // 👈 hide scrollbar
            decelerationRate="normal" // 👈 smooth momentum scroll on iOS
            scrollEventThrottle={16} // 👈 smooth 60fps events
          >
            {/* 🛍️ Cart Items */}
            <Box gap={12}>
              {cart.map((item, i) => (
                <Box
                  key={i}
                  flexDirection="row"
                  padding={12}
                  borderRadius={12}
                  backgroundColor="#fff"
                  shadowColor="#000"
                  shadowOpacity={0.08}
                  shadowRadius={8}
                  shadowOffset={{ width: 0, height: 4 }}
                  elevation={3}
                  alignItems="center"
                  gap={12}
                >
                  <Checkbox
                    value={String(item.product_id) + "-" + String(i)}
                    isChecked={selectedItems[i]}
                    onChange={() => handleSelectChange(i)}
                    aria-label="Select item"
                  />

                  <Image
                    source={{ uri: item.main_image_url }}
                    style={{ width: 80, height: 80, borderRadius: 10 }}
                  />

                  <Box flex={1} flexDirection="column" gap={4}>
                    <Text fontWeight="700" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text fontSize={12} color="#6b7280">
                      Size: {item.size} | Color: {item.color}
                    </Text>

                    <Box flexDirection="row" gap={6} alignItems="center">
                      {(item.discount ?? 0) > 0 && (
                        <Text fontWeight="700" color="#22c55e">
                          ₹
                          {getDiscountedPrice(
                            item.price,
                            item.discount ?? 0
                          ).toLocaleString()}
                        </Text>
                      )}
                      <Text
                        fontSize={12}
                        textDecorationLine={
                          (item.discount ?? 0) > 0 ? "line-through" : "none"
                        }
                        color="#9ca3af"
                      >
                        ₹{Number(item.price).toLocaleString()}
                      </Text>
                    </Box>

                    {/* Quantity Controls */}
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      gap={8}
                      marginTop={4}
                    >
                      {/* Decrement Button */}
                      <Button
                        onPress={() =>
                          updateCartItem(i, {
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                        disabled={item.quantity <= 1}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          backgroundColor:
                            item.quantity <= 1 ? "#e5e7eb" : "#111827",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Minus
                          size={16}
                          color={item.quantity <= 1 ? "#9ca3af" : "#fff"}
                        />
                      </Button>

                      {/* Quantity Display */}
                      <Text width={30} textAlign="center" fontWeight="600">
                        {item.quantity}
                      </Text>

                      {/* Increment Button */}
                      <Button
                        onPress={() =>
                          updateCartItem(i, {
                            quantity: Math.min(
                              item.stock_quantity,
                              item.quantity + 1
                            ),
                          })
                        }
                        disabled={item.quantity >= item.stock_quantity}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          backgroundColor:
                            item.quantity >= item.stock_quantity
                              ? "#e5e7eb"
                              : "#111827",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Plus
                          size={16}
                          color={
                            item.quantity >= item.stock_quantity
                              ? "#9ca3af"
                              : "#fff"
                          }
                        />
                      </Button>

                      {/* Remove Button */}
                      <Button
                        onPress={() => removeFromCart(i)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "#ef4444",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* 🧾 Invoice Summary */}
            <Box
              marginTop={20}
              padding={16}
              borderRadius={12}
              backgroundColor="#fff"
              shadowColor="#000"
              shadowOpacity={0.08}
              shadowRadius={8}
              shadowOffset={{ width: 0, height: 4 }}
              elevation={3}
            >
              <Box
                flexDirection="row"
                justifyContent="space-between"
                marginBottom={4}
              >
                <Text fontWeight="600">Subtotal</Text>
                <Text>₹{afterDiscAmount.toFixed(2)}</Text>
              </Box>
              <Box flexDirection="row" justifyContent="space-between">
                <Text>Shipping</Text>
                <Text color="#22c55e">Free</Text>
              </Box>

              <Divider marginVertical={8} />

              <Box flexDirection="row" justifyContent="space-between">
                <Text>You saved</Text>
                <Badge
                  style={{
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 6,
                    backgroundColor: "#22c55e20",
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

              <Divider marginVertical={8} />

              <Box
                flexDirection="row"
                justifyContent="space-between"
                marginTop={4}
              >
                <Text fontWeight="700" fontSize={16}>
                  Total
                </Text>
                <Text fontWeight="700" fontSize={16}>
                  ₹{afterDiscAmount.toFixed(2)}
                </Text>
              </Box>

              {!authUser?.is_logged_in ? (
                <Banner
                  title="Login Required"
                  description="You need to log in to place an order."
                  linkText="Login Now"
                  onClick={() => router.push("/signup")}
                />
              ) : !authUser.is_profile_completed ? (
                <Banner />
              ) : null}
            </Box>
          </ScrollView>

          {/* 📌 Sticky Bottom Checkout Bar (Safe Area + Tab Bar Aware) */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            backgroundColor="#fff"
            paddingHorizontal={16}
            paddingTop={12}
            paddingBottom={insets.bottom + tabBarHeight + 20} // safe area + tab height
            borderTopWidth={1}
            borderColor="#e5e7eb"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            shadowColor="#000"
            shadowOpacity={0.05}
            shadowRadius={8}
            elevation={6}
          >
            {/* Total Section */}
            <Box flexDirection="column">
              <Text fontSize={14} color="#6b7280">
                Total
              </Text>
              <Text fontWeight="700" fontSize={18} color="#111827">
                ₹{afterDiscAmount.toFixed(2)}
              </Text>
            </Box>

            {/* Place Order Button */}
            <Button
              disabled={isDisabled}
              onPress={() => {}}
              style={{
                marginLeft: 16,
                flex: 1,
                height: 40,
                borderRadius: 12,
                backgroundColor: isDisabled ? "#9ca3af" : "#2563eb",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 4,
                maxWidth: 200,
              }}
            >
              <Text color="#fff" fontWeight="700" fontSize={16}>
                Place Order
              </Text>
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
