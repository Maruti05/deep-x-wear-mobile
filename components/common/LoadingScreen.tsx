import { Box, Text } from "@gluestack-ui/themed";
import React from "react";
import { ActivityIndicator } from "react-native";

type LoadingScreenProps = {
  message?: string; // optional custom message
  color?: string;   // spinner color
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  color = "#2563eb", // default to your brand blue
}) => {
  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor="#fff"
    >
      <ActivityIndicator size="large" color={color} />
      <Text marginTop={12} fontSize={16} color="#374151">
        {message}
      </Text>
    </Box>
  );
};

export default LoadingScreen;