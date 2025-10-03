import { ProductType } from "@/app/types/ProductType";
import { Badge, Box, Card, Text } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

interface ProductCardProps extends ProductType {
  item?: ProductType;
  onPress?: (item: ProductType) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
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
    <TouchableOpacity
      onPress={() => router.push(`/product/${id}`)}
      style={{ flex: 1 }}
    >
      <Card
        style={{
          flex: 1,
          overflow: "hidden",
          //   borderRadius: 8,
          backgroundColor: "#fff",
        }}
      >
        {/* Image Section */}
        <Box width="100%" aspectRatio={1} overflow="hidden" position="relative">
          <Image
            source={{ uri: mainImageUrl }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            accessibilityLabel={name}
            // placeholder={require('../assets/images/react-logo.png')}
          />

          {discount && discount > 0 && (
            <Badge
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: "#22c55e",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text color="#fff" fontSize={12} fontWeight="bold">
                {discount}% OFF
              </Text>
            </Badge>
          )}
        </Box>

        {/* Content Section */}
        <Box padding={8}>
          <Text
            fontSize={16}
            fontWeight="600"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>

          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginTop={4}
          >
            <Text fontSize={14} fontWeight="500">
              ₹ {Number(displayPrice).toLocaleString()}
            </Text>
            {discount && discount > 0 && (
              <Text
                fontSize={12}
                style={{ textDecorationLine: "line-through", color: "#6b7280" }}
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
};
