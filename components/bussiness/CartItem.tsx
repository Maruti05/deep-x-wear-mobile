import { getDiscountedPrice } from "@/app/lib/utils";
import { CartItemProps } from "@/app/types/CartItem";
import { Box, Button, Checkbox, Text } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { Minus, Plus, Trash2 } from "lucide-react-native";
import React from "react";
import { StyleSheet } from "react-native";

export const CartItem: React.FC<CartItemProps> = React.memo(
  function CartItem({ item, i, selected, onSelect, updateCartItem, removeFromCart }) {
    return (
      <Box
        key={i}
        flexDirection="row"
        padding={14}
        borderRadius={8}
        backgroundColor="#fff"
        shadowColor="#000"
        shadowOpacity={0.08}
        shadowRadius={10}
        shadowOffset={{ width: 0, height: 4 }}
        elevation={3}
        alignItems="center"
      style={styles.cartItem}
    >
      <Checkbox
        value={String(item.product_id) + "-" + String(i)}
        isChecked={selected}
        onChange={() => onSelect(i)}
        aria-label="Select item"
      />
      <Image
        source={{ uri: item.main_image_url }}
        style={styles.cartImage}
      />
      <Box flex={1} flexDirection="column" style={styles.cartDesc}>
        <Text fontWeight="700" numberOfLines={1}>
          {item.name}
        </Text>
        <Text fontSize={12} color="#6b7280">
          Size: {item.size} | Color: {item.color}
        </Text>
        <Box flexDirection="row" alignItems="center" marginTop={6}>
          {(item.discount ?? 0) > 0 && (
            <Text fontWeight="700" color="#22c55e">
              ₹{getDiscountedPrice(item.price, item.discount ?? 0).toLocaleString()}
            </Text>
          )}
          <Text
            fontSize={12}
            textDecorationLine={
              (item.discount ?? 0) > 0 ? "line-through" : "none"
            }
            color="#9ca3af"
            style={{ marginLeft: 8 }}
          >
            ₹{Number(item.price).toLocaleString()}
          </Text>
        </Box>
        {/* Quantity Controls */}
        <Box flexDirection="row" alignItems="center" marginTop={8}>
          <Button
            onPress={() =>
              updateCartItem(i, {
                quantity: Math.max(1, item.quantity - 1),
              })
            }
            disabled={item.quantity <= 1}
            style={[
              styles.qtyBtn,
              {
                backgroundColor:
                  item.quantity <= 1 ? "#e5e7eb" : "#111827",
              },
            ]}
          >
            <Minus
              size={16}
              color={item.quantity <= 1 ? "#9ca3af" : "#fff"}
            />
          </Button>
          <Text width={35} textAlign="center" fontWeight="600">
            {item.quantity}
          </Text>
          <Button
            onPress={() =>
              updateCartItem(i, {
                quantity: Math.min(item.stock_quantity, item.quantity + 1),
              })
            }
            disabled={item.quantity >= item.stock_quantity}
            style={[
              styles.qtyBtn,
              {
                backgroundColor:
                  item.quantity >= item.stock_quantity
                    ? "#e5e7eb"
                    : "#111827",
                marginLeft: 5,
              },
            ]}
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
          <Button
            onPress={() => removeFromCart(i)}
            style={[
              styles.qtyBtn,
              {
                borderWidth: 1,
                borderColor: "#ef4444",
                backgroundColor: "#fff",
                marginLeft: 5,
              },
            ]}
          >
            <Trash2 size={16} color="#ef4444" />
          </Button>
        </Box>
      </Box>
    </Box>
  );
});
const styles = StyleSheet.create({
  cartItem: {
    // marginVertical: 3,
    // marginHorizontal: 2,
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