import { Carousel } from "@/components/bussiness/Carousel";
import { ProductCard } from "@/components/bussiness/ProductCart";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Colors } from "@/constants/theme";
import { useProducts } from "@/hooks/useProducts";
import { Box, Text } from "@gluestack-ui/themed";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "expo-router";
import { Filter } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import { FlatList, Image, Pressable, RefreshControl } from "react-native";
import { ProductType } from "../types/ProductType";

// Import Filter Component
import { FilterBottomSheet } from "@/components/common/FilterBottomSheet";

export default function Home() {
  const { refresh, isError, isLoading, products } = useProducts();
  const trendyImages =
    products
      ?.filter((p: ProductType) => p.is_trendy)
      .map((p) => p.main_image_url) || [];

  const navigation = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

 const openFilter = useCallback(() => {
  if (bottomSheetModalRef.current) {
    bottomSheetModalRef.current.snapToIndex(0);
  } else {
    console.log("Ref is null!");
  }
}, []);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  // Filter logic
  const filteredProducts = products?.filter((p: ProductType) => {
    let matchCategory = selectedCategory
      ? p.category_id === selectedCategory
      : true;
    let matchGender = selectedGender ? p.description === selectedGender : true;
    return matchCategory && matchGender;
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Image
          source={require("@/assets/images/logo-d.svg")} // replace with your logo
          style={{
            width: 'auto',
            height: 40,
            resizeMode: "contain",
            tintColor: "transparent",
          }}
          // tintColor={Colors.dark.text}
        />
      ),
      headerRight: () => (
        <Pressable onPress={openFilter} style={{ paddingRight: 16 }}>
          <Filter size={24} color={Colors.light.text} />
        </Pressable>
      ),
      headerTitleAlign: "left",
    });
  }, [navigation]);

  if (isLoading && !products?.length) {
    return <LoadingScreen message="Loading ..." />;
  }

  if (isError) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" padding={16}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          Failed to load products. Pull to refresh.
        </Text>
      </Box>
    );
  }

  return (
    <>
      <BottomSheetModalProvider>
        <Box style={{ flex: 1 }} paddingHorizontal={2}>
          {/* Carousel */}

          {/* Product List */}
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ProductCard {...item} item={item} />}
            numColumns={2}
            ItemSeparatorComponent={() => <Box height={2} />}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refresh} />
            }
            removeClippedSubviews
            initialNumToRender={8}
            maxToRenderPerBatch={12}
            windowSize={10}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 80,
              paddingTop: 10,
              paddingHorizontal: 4,
            }}
            ListHeaderComponent={
              trendyImages.length > 0 ? (
                <Carousel
                  items={trendyImages}
                  autoPlay
                  onPressItem={(uri, idx) => console.log("Pressed", idx, uri)}
                  height={350}
                />
              ) : null
            }
          />
        </Box>

        {/* Filter Bottom Sheet */}
        <FilterBottomSheet
          ref={bottomSheetModalRef}
          selectedCategory={selectedCategory}
          selectedGender={selectedGender}
          onApply={(cat, gender) => {
            setSelectedCategory(cat);
            setSelectedGender(gender);
            bottomSheetModalRef.current?.dismiss();
          }}
        />
      </BottomSheetModalProvider>
    </>
  );
}
