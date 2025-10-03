import { Carousel } from "@/components/bussiness/Carousel";
import { ProductCard } from "@/components/bussiness/ProductCart";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useProducts } from "@/hooks/useProducts";
import { Box, Text } from "@gluestack-ui/themed";
import { router } from "expo-router";
import React, { memo, useCallback } from "react";
import { FlatList, Platform, RefreshControl, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { ProductType } from "../types/ProductType";

// Memoized ProductCard to avoid unnecessary re-renders
const MemoProductCard = memo(ProductCard);

export default function Home() {
  const { refresh, isError, isLoading, products } = useProducts();
  const trendyImages =
    products
      ?.filter((p: ProductType) => p.is_trendy)
      .map((p) => p.main_image_url) || [];

  // All hooks MUST run before any early returns
  const renderProduct = useCallback(
    ({ item }: { item: ProductType }) => {
      const content = (
        <Box style={styles.productCard}>
          <MemoProductCard {...item} item={item} />
        </Box>
      );
      // TouchableNativeFeedback for Android ripple effect, fallback to View/Box on iOS
      return (
        <View style={styles.productColumn}>
          {Platform.OS === "android" ? (
            <TouchableNativeFeedback
              onPress={() => {/* Optionally add navigation here */}}
              background={TouchableNativeFeedback.Ripple("#E5E7EB", false)}
            >
              {content}
            </TouchableNativeFeedback>
          ) : (
            content
          )}
        </View>
      );
    },
    []
  );

  // Optimize item layout for performant FlatList
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 260, // approximate card height
      offset: 260 * index,
      index,
    }),
    []
  );

  // EARLY RETURNS okay after all hooks
  if (isLoading && !products?.length) {
    return <LoadingScreen message="Loading ..." />;
  }

  if (isError) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" padding={16} style={styles.bgGray}>
        <Text fontSize={18} fontWeight="700" color="#111827">
          Failed to load products.
        </Text>
        <Text fontSize={14} color="#6B7280" marginTop={8}>
          Pull down to refresh
        </Text>
      </Box>
    );
  }

  return (
    <Box style={styles.page}>
      <FlatList
        data={products}
        keyExtractor={item => String(item.id)}
        renderItem={renderProduct}
        numColumns={2}
        ItemSeparatorComponent={() => <Box height={4} />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} />
        }
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={7}
        showsVerticalScrollIndicator={false}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.grid}
        ListHeaderComponent={
          trendyImages.length > 0 ? (
            <Box style={styles.carouselContainer}>
              <Carousel
                items={trendyImages}
                autoPlay
                onPressItem={(uri, idx) => router.push(`/product/${products[idx].id}`)}
                height={340}
              />
            </Box>
          ) : null
        }
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  bgGray: {
    backgroundColor: "#f6f7fb",
  },
  grid: {
    paddingBottom: 80,
    paddingTop: 10,
    paddingHorizontal: 2,
  },
  productColumn: {
    flex: 1,
    padding: 2,
  },
  productCard: {
    backgroundColor: "#fff",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 11,
    elevation: 5,
    overflow: "hidden",
  },
  carouselContainer: {
    marginBottom: 4,
  },
});
