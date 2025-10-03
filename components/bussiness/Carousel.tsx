import { Box } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";

interface CarouselProps {
  items: string[];
  autoPlay?: boolean;
  interval?: number;
  height?: number;
  onPressItem?: (uri: string, index: number) => void;
}

// Memoized carousel image for performance
const CarouselImage = memo(({ uri, width, height }: { uri: string, width: number, height: number }) => (
  <Animated.Image
    source={{ uri }}
    style={{ width, height, resizeMode: "cover" }}
  />
));

export function Carousel({
  items,
  autoPlay = true,
  interval = 3000,
  height,
  onPressItem,
}: CarouselProps) {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const ITEM_WIDTH = width;
  const CARD_HEIGHT = height ?? Math.round(ITEM_WIDTH * 0.56);

  // All refs/hooks at the top for rules
  const flatListRef = useRef<FlatList<string>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const isInteractingRef = useRef(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Gradient colors for black and white theme
  const gradientColors: [string, string] = colorScheme === 'dark'
    ? ['#222', '#181818']
    : ['#fff', '#e5e5e5'];

  // Stable key extractor and renderItem
  const keyExtractor = useCallback((_: string, idx: number) => `carousel-${idx}`, []);
  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      const inputRange = [
        (index - 1) * ITEM_WIDTH,
        index * ITEM_WIDTH,
        (index + 1) * ITEM_WIDTH,
      ];
      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.97, 1, 0.97],
        extrapolate: "clamp",
      });
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.8, 1, 0.8],
        extrapolate: "clamp",
      });
      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [18, 0, 18],
        extrapolate: "clamp",
      });
      return (
        <Pressable
          onPress={() => onPressItem?.(item, index)}
          style={{ width: ITEM_WIDTH, height: CARD_HEIGHT }}
        >
          <Animated.View
            style={{
              flex: 1,
              borderRadius: 16,
              overflow: "hidden",
              transform: [{ scale }, { translateY }],
              opacity,
              backgroundColor: "#fff",
              shadowColor: "#111827",
              shadowOffset: { width: 0, height: 7 },
              shadowOpacity: 0.14,
              shadowRadius: 23,
              elevation: 9,
            }}
          >
            <CarouselImage uri={item} width={ITEM_WIDTH} height={CARD_HEIGHT} />
          </Animated.View>
        </Pressable>
      );
    },
    [onPressItem, ITEM_WIDTH, CARD_HEIGHT, scrollX]
  );

  // Auto-play management
  const stopAuto = useCallback(() => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
  }, []);
  const scheduleNext = useCallback(() => {
    stopAuto();
    if (!autoPlay || items.length < 2) return;
    autoTimerRef.current = setTimeout(() => {
      if (!autoPlay || isInteractingRef.current) return scheduleNext();
      const nextIndex = (currentIndex + 1) % items.length;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * ITEM_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, interval);
  }, [autoPlay, currentIndex, interval, items.length, ITEM_WIDTH, stopAuto]);

  useEffect(() => {
    if (autoPlay) scheduleNext();
    return stopAuto;
  }, [scheduleNext, autoPlay, stopAuto]);

  const onMomentumScrollEnd = useCallback(
    (e: any) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / ITEM_WIDTH);
      setCurrentIndex(index);
      isInteractingRef.current = false;
    },
    [ITEM_WIDTH]
  );

  if (!items || items.length === 0) return null;

  return (
    <Box style={{ width: ITEM_WIDTH, alignSelf: "center" }}>
      <LinearGradient
        colors={gradientColors}
        style={{
          width: "100%",
          height: CARD_HEIGHT,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <Animated.FlatList
        ref={flatListRef as any}
        data={items}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces
        pagingEnabled
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScrollBeginDrag={() => (isInteractingRef.current = true)}
        onMomentumScrollBegin={() => (isInteractingRef.current = true)}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={renderItem}
        style={{ zIndex: 9 }}
      />
      <View
        style={{ flexDirection: "row", justifyContent: "center", marginTop: 12 }}
      >
        {items.map((_, i) => {
          const inputRange = [
            (i - 1) * ITEM_WIDTH,
            i * ITEM_WIDTH,
            (i + 1) * ITEM_WIDTH,
          ];
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.22, 0.8],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={`dot-${i}`}
              style={{
                height: 8,
                width: 8,
                borderRadius: 4,
                marginHorizontal: 5,
                backgroundColor: "#3B82F6",
                opacity,
                transform: [{ scale }],
              }}
            />
          );
        })}
      </View>
    </Box>
  );
}
