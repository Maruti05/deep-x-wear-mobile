import { ProductType } from "@/app/types/ProductType";
import { Badge, Box, Card, Text } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface ProductCardProps extends ProductType {
  item?: ProductType;
  onPress?: (item: ProductType) => void;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({
  description,
  discount,
  main_image_url: mainImageUrl,
  name,
  price,
  calculated_price: calculatedPrice,
  item,
  id,
  onPress,
}) => {
  const router = useRouter();
  const displayPrice = calculatedPrice || price;


  return (
    <TouchableOpacity onPress={()=>router.push(`/product/${id}`)} activeOpacity={0.84} style={cardStyles.touchable}>
      <Card style={cardStyles.card}>
        {/* Image Section */}
        <Box width="100%" aspectRatio={0.8} overflow="hidden" position="relative">
          <Image
            source={{ uri: mainImageUrl }}
            style={cardStyles.image}
            contentFit="cover"
            accessibilityLabel={name}
            transition={180}
            cachePolicy="memory-disk"
          />
          {discount && discount > 0 && (
            <Badge style={cardStyles.badge}>
              <Text color="#fff" fontSize={12} fontWeight="bold">
                {discount}% OFF
              </Text>
            </Badge>
          )}
        </Box>
        {/* Content Section */}
        <Box padding={10} style={{ minHeight: 76 }}>
          <Text
            fontSize={16}
            fontWeight="600"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginTop={6}>
            <Text fontSize={15} fontWeight="600">
              ₹ {Number(displayPrice).toLocaleString()}
            </Text>
            {discount && discount > 0 && (
              <Text
                fontSize={12}
                style={cardStyles.strikeText}
              >
                ₹ {Number(price).toLocaleString()}
              </Text>
            )}
          </Box>
          {description && (
            <Text
              fontSize={12}
              color="#6b7280"
              marginTop={4}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {description}
            </Text>
          )}
        </Box>
      </Card>
    </TouchableOpacity>
  );
});

const cardStyles = StyleSheet.create({
  touchable: {
    flex: 1,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.11,
    shadowRadius: 22,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f3f4f6",
  },
  badge: {
    position: "absolute",
    top: 9,
    left: 9,
    backgroundColor: "#22c55e",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    elevation: 2,
    zIndex: 2,
  },
  strikeText: {
    textDecorationLine: "line-through",
    color: "#6b7280",
    marginLeft: 7,
  }
});
