import { Box, useTheme } from "@gluestack-ui/themed";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
// Replace this:
// import LinearGradient from 'react-native-linear-gradient';

// With this:
import { LinearGradient } from "expo-linear-gradient";

interface CarouselProps {
  items: string[];
  autoPlay?: boolean;
  interval?: number;
  height?: number;
  onPressItem?: (uri: string, index: number) => void;
}

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
  const theme = useTheme();

  if (!items || items.length === 0) return null;

  const flatListRef = useRef<FlatList<string>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const isInteractingRef = useRef(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-play logic
  const stopAuto = () => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
  };

  const scheduleNext = () => {
    stopAuto();
    if (!autoPlay || items.length < 2) return;

    autoTimerRef.current = setTimeout(() => {
      if (!autoPlay || isInteractingRef.current) return scheduleNext();
      const nextIndex = (currentIndex + 1) % items.length;
      Animated.spring(scrollX, {
        toValue: nextIndex * ITEM_WIDTH,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }).start();
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * ITEM_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
      scheduleNext();
    }, interval);
  };

  useEffect(() => {
    if (autoPlay) scheduleNext();
    return stopAuto;
  }, [currentIndex, autoPlay, interval]);

  const onMomentumScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    setCurrentIndex(index);
    isInteractingRef.current = false;
  };

  // Gradient colors for black & white theme
  const gradientColors: [string, string] = colorScheme === 'dark'
  ? ['#1E1E1E', '#2C2C2C']
  : ['#FFFFFF', '#E5E5E5'];


  return (
    <Box>
      {/* Background Gradient */}
      <LinearGradient
        colors={gradientColors}
        style={{
          width: "100%",
          height: CARD_HEIGHT,
          position: "absolute",
          top: 0,
        }}
      />

      <Animated.FlatList
        ref={flatListRef as any}
        data={items}
        keyExtractor={(_, idx) => `carousel-${idx}`}
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
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.95, 1, 0.95],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: "clamp",
          });
          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-30, 0, 30],
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
                  transform: [{ scale }, { translateX }],
                  opacity,
                }}
              >
                <Animated.Image
                  source={{ uri: item }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "cover",
                    borderRadius: 0,
                  }}
                />
              </Animated.View>
            </Pressable>
          );
        }}
      />

      {/* Dots indicator */}
      <View
        style={{ flexDirection: "row", justifyContent: "center", marginTop: 8 }}
      >
        {items.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (i - 1) * ITEM_WIDTH,
              i * ITEM_WIDTH,
              (i + 1) * ITEM_WIDTH,
            ],
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });
          const scale = scrollX.interpolate({
            inputRange: [
              (i - 1) * ITEM_WIDTH,
              i * ITEM_WIDTH,
              (i + 1) * ITEM_WIDTH,
            ],
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={`dot-${i}`}
              style={{
                height: 8,
                width: 8,
                borderRadius: 4,
                marginHorizontal: 4,
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
