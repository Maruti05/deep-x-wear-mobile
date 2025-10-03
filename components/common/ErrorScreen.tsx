import { Box, Button, Text } from "@gluestack-ui/themed";
import React from "react";

type ErrorScreenProps = {
  message?: string;
  onRetry?: () => void;
};

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <Box flex={1} alignItems="center" justifyContent="center" padding={16} backgroundColor="#fff">
      <Text fontSize={16} color="#ef4444" textAlign="center">
        {message}
      </Text>
      {onRetry && (
        <Button marginTop={16} onPress={onRetry} style={{ borderRadius: 8 }}>
          <Text color="#fff" fontWeight="600">Retry</Text>
        </Button>
      )}
    </Box>
  );
};

export default ErrorScreen;