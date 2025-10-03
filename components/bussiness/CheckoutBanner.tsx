import { Box, Button, Text } from "@gluestack-ui/themed";
import { AlertCircle, CheckCircle, Info, LucideIcon } from "lucide-react-native";
import React from "react";

interface BannerProps {
  title?: string;
  description?: string;
  linkHref?: string; // For RN, we can use onPress instead
  linkText?: string;
  icon?: LucideIcon;
  variant?: "info" | "warning" | "success" | "error";
  onClick?: () => void;
}

const variantStyles = {
  info: {
    borderColor: "#3b82f6",
    textColor: "#1e40af",
    iconColor: "#1e40af",
    defaultIcon: Info,
  },
  warning: {
    borderColor: "#facc15",
    textColor: "#b45309",
    iconColor: "#b45309",
    defaultIcon: Info,
  },
  success: {
    borderColor: "#22c55e",
    textColor: "#166534",
    iconColor: "#166534",
    defaultIcon: CheckCircle,
  },
  error: {
    borderColor: "#ef4444",
    textColor: "#b91c1c",
    iconColor: "#b91c1c",
    defaultIcon: AlertCircle,
  },
};

export default function Banner({
  title = "Incomplete Profile",
  description = "Please update your profile details to proceed.",
  linkText = "Go to Profile",
  variant = "warning",
  icon,
  onClick,
}: BannerProps) {
  const styles = variantStyles[variant];
  const IconComponent = icon || styles.defaultIcon;

  return (
    <Box
      flexDirection="row"
      alignItems="flex-start"
      gap={2}
      borderWidth={1}
      borderColor={styles.borderColor}
      padding={3}
      borderRadius={8}
      marginTop={4}
      backgroundColor="white"
    >
      <IconComponent color={styles.iconColor} size={18} style={{ marginTop: 2 }} />
      <Box flex={1} flexDirection="column">
        <Text fontWeight="bold" fontSize={12} color={styles.textColor}>
          {title}
        </Text>
        <Text fontSize={12} color={styles.textColor} marginTop={1}>
          {description}{" "}
          {onClick ? (
            <Button
              onPress={onClick}
              style={{ backgroundColor: "transparent", elevation: 0 }}
            >
                <Text sx={{ textDecorationLine: "underline", fontWeight: "bold", color: "#2563eb" }}>
              {linkText}
              </Text>
            </Button>
          ) : null}
        </Text>
      </Box>
    </Box>
  );
}
