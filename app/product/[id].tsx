import { getProductById } from "@/api/products";
import { useCart } from "@/app/context/CartContext";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Badge, Box, Button, Card, Text } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, ShoppingCart, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { ProductType } from "../types/ProductType";
export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const productId = Array.isArray(id) ? id[0] : id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      getProductById(productId).then((res) => {
        if (res) {
          setProduct(res);
          setSize(res.sizes?.[0] ?? "");
          setColor(res.colors?.[0]?.name ?? "");
        }
      });
    }
  }, [productId]);

  if (!product) {
    return <LoadingScreen message="Loading product..." />;
  }

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      main_image_url: product.main_image_url,
      size,
      color,
      quantity,
      discount: product.discount,
      calculated_price: product.calculated_price,
      stock_quantity: product.stock_quantity,
    });
  };

  // Utility: check if color is light or dark
  const isColorLight = (hex: string) => {
    // Remove # if present
    const c = hex.startsWith("#") ? hex.substring(1) : hex;
    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);

    // Perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150; // true = light, false = dark
  };
  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const displayPrice = product.calculated_price || product.price;

  return (
    <Box flex={1} backgroundColor="#fff">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false} // 👈 hide scrollbar
        decelerationRate="normal" // 👈 smooth momentum scroll on iOS
        scrollEventThrottle={16} // 👈 smooth 60fps events
      >
        {/* Image */}
        <Card
          style={{
            width: "100%",
            aspectRatio: 1,
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 20,
            backgroundColor: "#f3f4f6",
          }}
        >
          <Image
            source={{ uri: product.main_image_url }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </Card>

        {/* Title & Price */}
        <Text fontSize={22} fontWeight="700">
          {product.name}
        </Text>
        <Box
          flexDirection="row"
          alignItems="center"
          marginTop={6}
          justifyContent="space-between"
        >
          <Box flexDirection="row" alignItems="center">
            <Text fontSize={18} fontWeight="600" color="#111827">
              ₹ {Number(displayPrice).toLocaleString()}
            </Text>
            {product.discount > 0 && (
              <Text
                fontSize={12}
                style={{
                  textDecorationLine: "line-through",
                  marginLeft: 8,
                  color: "#9ca3af",
                }}
              >
                ₹ {Number(product.price).toLocaleString()}
              </Text>
            )}
          </Box>
          {product.discount > 0 && (
            <Badge
              //   marginTop={8}
              style={{
                backgroundColor: "#22c55e",
                borderRadius: 6,
                paddingHorizontal: 1,
                paddingVertical: 1,
              }}
            >
              <Text color="#fff">{product.discount}% OFF</Text>
            </Badge>
          )}
        </Box>

        {/* Description */}
        {product.description && (
          <Text fontSize={14} color="#4b5563" marginTop={12} lineHeight={20}>
            {product.description}
          </Text>
        )}

        {/* Size Selection */}
        <Box marginTop={20}>
          <Text fontSize={16} fontWeight="600" marginBottom={8}>
            Select Size
          </Text>
          <Box flexDirection="row" flexWrap="wrap" gap={10}>
            {product.sizes.map((s: string) => {
              const selected = size === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => setSize(s)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 4,
                    // borderWidth: 1.5,
                    borderColor: selected ? "#111827" : "#d1d5db",
                    backgroundColor: selected ? "#111827" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: selected ? "#fff" : "#111827",
                      fontWeight: "600",
                    }}
                  >
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </Box>
        </Box>

        {/* Color Selection */}

        <Box marginTop={24}>
          <Text
            fontSize={16}
            fontWeight="700"
            marginBottom={12}
            color="#111827"
          >
            Select Color
          </Text>

          <Box flexDirection="row" flexWrap="wrap" gap={10}>
            {product.colors.map((c: any) => {
              const selected = color === c.name;
              const light = isColorLight(c.code);

              return (
                <Pressable
                  key={c.code}
                  onPress={() => setColor(c.name)}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    width={40}
                    height={40}
                    alignItems="center"
                    justifyContent="center"
                    borderRadius={24}
                    style={{
                      backgroundColor: "#fff", // neutral wrapper
                      elevation: selected ? 4 : 1,
                      shadowColor: "#000",
                      shadowOpacity: selected ? 0.2 : 0.05,
                      shadowRadius: selected ? 6 : 3,
                      shadowOffset: { width: 0, height: 2 },
                      borderWidth: selected ? 2.5 : 1,
                      borderColor: selected ? "#111827" : "#d1d5db",
                    }}
                  >
                    {/* Inner swatch */}
                    <Box
                      width={32}
                      height={32}
                      borderRadius={16}
                      alignItems="center"
                      justifyContent="center"
                      style={{ backgroundColor: c.code }}
                    >
                      {selected && (
                        <Check
                          size={18}
                          color={light ? "#111827" : "#fff"} // dynamic icon color
                          strokeWidth={3}
                        />
                      )}
                    </Box>
                  </Box>

                  <Text
                    fontSize={12}
                    marginTop={6}
                    color="#374151"
                    style={{ textTransform: "capitalize", fontWeight: "600" }}
                  >
                    {c.name}
                  </Text>
                </Pressable>
              );
            })}
          </Box>
        </Box>

        {/* Quantity */}
        <Box marginTop={20}>
          <Text fontSize={16} fontWeight="600" marginBottom={8}>
            Quantity
          </Text>
          <Box flexDirection="row" alignItems="center" gap={16}>
            <Pressable
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity === 1}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: quantity === 1 ? "#e5e7eb" : "#111827",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text color={quantity === 1 ? "#9ca3af" : "#fff"} fontSize={20}>
                −
              </Text>
            </Pressable>

            <Text fontSize={18} fontWeight="600">
              {quantity}
            </Text>

            <Pressable
              onPress={() =>
                setQuantity(Math.min(product.stock_quantity, quantity + 1))
              }
              disabled={quantity >= product.stock_quantity}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor:
                  quantity >= product.stock_quantity ? "#e5e7eb" : "#111827",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                color={quantity >= product.stock_quantity ? "#9ca3af" : "#fff"}
                fontSize={20}
              >
                +
              </Text>
            </Pressable>
          </Box>
        </Box>

        {/* Stock Info */}
        <Box marginTop={20}>
          {product.stock_quantity > 0 ? (
            // <Badge style={{ backgroundColor: "#22c55e", borderRadius: 6 }}>
            //   <Text style={{ color: "#fff" }}>
            //     In Stock ({product.stock_quantity})
            //   </Text>
            // </Badge>
            <></>
          ) : (
            <Badge style={{ backgroundColor: "#ef4444", borderRadius: 6 }}>
              <Text style={{ color: "#fff" }}>Out of Stock</Text>
            </Badge>
          )}
        </Box>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}

      <Box
        position="absolute"
        bottom={16}
        left={16}
        right={16}
        flexDirection="row"
        gap={12}
        backgroundColor="transparent"
      >
        {/* Add to Cart */}
        <Button
          flex={1}
          onPress={handleAddToCart}
          disabled={product.stock_quantity === 0}
          style={{
            height: 50,
            borderRadius: 16,
            backgroundColor: "#111827",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 6,
            elevation: 6, // Android shadow
          }}
        >
          <ShoppingCart size={20} color="#fff" />
          <Text color="#fff" fontWeight="700" fontSize={16}>
            Add to Cart
          </Text>
        </Button>

        {/* Buy Now */}
        <Button
          flex={1}
          onPress={handleBuyNow}
          disabled={product.stock_quantity === 0}
          style={{
            height: 50,
            borderRadius: 16,
            backgroundColor: "#2563eb",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 6,
            elevation: 6,
          }}
        >
          <Zap size={20} color="#fff" />
          <Text color="#fff" fontWeight="700" fontSize={16}>
            Buy Now
          </Text>
        </Button>
      </Box>
    </Box>
  );
}
