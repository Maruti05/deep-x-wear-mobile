import { Box, Button, Text } from "@gluestack-ui/themed";
import { AlertCircle, CheckCircle, Info, LucideIcon } from "lucide-react-native";
import React from "react";

interface BannerProps {
  title?: string;
  description?: string;
  linkHref?: string;
  linkText?: string;
  icon?: LucideIcon;
  variant?: "info" | "warning" | "success" | "error";
  onClick?: () => void;
}

const variantStyles = {
  info: {
    borderColor: "#3b82f6",
    textColor: "#1e40af",
    iconColor: "#3b82f6",
    bgColor: "#eff6ff",
    defaultIcon: Info,
  },
  warning: {
    borderColor: "#facc15",
    textColor: "#b45309",
    iconColor: "#f59e42",
    bgColor: "#fefce8",
    defaultIcon: Info,
  },
  success: {
    borderColor: "#22c55e",
    textColor: "#166534",
    iconColor: "#22c55e",
    bgColor: "#f0fdf4",
    defaultIcon: CheckCircle,
  },
  error: {
    borderColor: "#ef4444",
    textColor: "#b91c1c",
    iconColor: "#ef4444",
    bgColor: "#fef2f2",
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
      alignItems="center"
      borderWidth={1}
      borderColor={styles.borderColor}
      backgroundColor={styles.bgColor}
      padding={14}
      borderRadius={13}
      shadowColor="#000"
      shadowOpacity={0.06}
      shadowRadius={8}
      shadowOffset={{ width: 0, height: 3 }}
      elevation={2}
      marginTop={10}
      minHeight={62}
    >
      <Box justifyContent="center" alignItems="center" marginRight={12}>
        <IconComponent color={styles.iconColor} size={22} />
      </Box>
      <Box flex={1} flexDirection="column" justifyContent="center">
        <Text fontWeight="bold" fontSize={14} color={styles.textColor}>
          {title}
        </Text>
        <Box flexDirection="row" flexWrap="wrap" alignItems="center" marginTop={3}>
          <Text fontSize={13} color={styles.textColor}>
            {description}
          </Text>
          {onClick ? (
            <Button
              onPress={onClick}
              
              style={{
                paddingHorizontal: 6,
                backgroundColor: "transparent",
                elevation: 0,
                minHeight: 0,
              }}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  fontWeight: "bold",
                  color: "#2563eb",
                  fontSize: 13,
                  marginLeft: 4,
                }}
              >
                {linkText}
              </Text>
            </Button>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
