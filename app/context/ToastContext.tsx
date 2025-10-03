// ToastProvider.tsx
import {
    Button,
    ButtonText,
    CloseIcon,
    HStack,
    Icon,
    Pressable,
    Toast,
    ToastDescription,
    ToastTitle,
    useColorMode,
    useToast,
    VStack
} from "@gluestack-ui/themed";
import * as Haptics from "expo-haptics";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react-native";
import React, { createContext, useContext, useRef } from "react";
import { Animated, Dimensions, Platform } from "react-native";

// Improved type definitions
type ToastVariant = "success" | "error" | "warning" | "info";
type ToastPlacement = "top" | "bottom";
type ToastAnimation = "slide" | "fade" | "bounce";

type ToastOptions = {
  title: string;
  description?: string;
  placement?: ToastPlacement;
  duration?: number; // ms
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
  showCloseButton?: boolean;
  animation?: ToastAnimation;
  enableHaptics?: boolean;
  width?: number | string;
};

type ToastContextType = {
  showToast: (options: ToastOptions) => string | number;
  closeToast: (id: string | number) => void;
  closeAllToasts: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toast = useToast();
  const  colorMode  = useColorMode();
  const animationRef = useRef(new Animated.Value(0));
  
  // Helper to get background color based on variant and color mode
  const getBackgroundColor = (variant: ToastVariant) => {
    const isDark = colorMode === "dark";
    
    switch (variant) {
      case "success":
        return isDark ? "$green900" : "$green100";
      case "error":
        return isDark ? "$red900" : "$red100";
      case "warning":
        return isDark ? "$yellow900" : "$yellow100";
      case "info":
      default:
        return isDark ? "$blue900" : "$blue100";
    }
  };

  // Helper to get text color based on variant and color mode
  const getTextColor = (variant: ToastVariant) => {
    const isDark = colorMode === "dark";
    
    switch (variant) {
      case "success":
        return isDark ? "$green300" : "$green700";
      case "error":
        return isDark ? "$red300" : "$red700";
      case "warning":
        return isDark ? "$yellow300" : "$yellow700";
      case "info":
      default:
        return isDark ? "$blue300" : "$blue700";
    }
  };

  // Helper to get icon based on variant
  const getIcon = (variant: ToastVariant) => {
    const color = getTextColor(variant);
    
    switch (variant) {
      case "success":
        return <Icon as={CheckCircle} color={color} size="lg" />;
      case "error":
        return <Icon as={XCircle} color={color} size="lg" />;
      case "warning":
        return <Icon as={AlertTriangle} color={color} size="lg" />;
      case "info":
      default:
        return <Icon as={Info} color={color} size="lg" />;
    }
  };

  // Apply haptic feedback based on variant
  const triggerHaptic = (variant: ToastVariant, enableHaptics?: boolean) => {
    if (!enableHaptics || Platform.OS === "web") return;
    
    switch (variant) {
      case "error":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case "success":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "warning":
      case "info":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
    }
  };

  // Show toast with enhanced features
  const showToast = ({
    title,
    description,
    placement = "top",
    duration = 5000,
    variant = "info",
    actionLabel,
    onAction,
    showCloseButton = true,
    animation = "slide",
    enableHaptics = true,
    width = "92%",
  }: ToastOptions) => {
    triggerHaptic(variant, enableHaptics);
    
    return toast.show({
      placement,
      duration,
      render: ({ id }) => {
        const toastId = `toast-${id}`;
        
        return (
          <Toast 
            nativeID={toastId}
            action="custom"
            variant="solid"
            backgroundColor={getBackgroundColor(variant)}
            borderRadius="$lg"
            p="$4"
            mb={placement === "top" ? "$4" : 0}
            mt={placement === "bottom" ? "$4" : 0}
            borderLeftWidth={4}
            borderLeftColor={getTextColor(variant)}
            width={typeof width === "string" ? width : `${width}px`}
            maxWidth={SCREEN_WIDTH - 32}
            shadowColor="$backgroundDark800"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.15}
            shadowRadius={8}
            elevation={5}
          >
            <HStack space="md" alignItems="flex-start" justifyContent="space-between">
              <HStack space="sm" alignItems="center" flex={1}>
                {getIcon(variant)}
                
                <VStack space="xs" flex={1}>
                  <ToastTitle color={getTextColor(variant)} fontWeight="$semibold">
                    {title}
                  </ToastTitle>
                  
                  {description ? (
                    <ToastDescription color={getTextColor(variant)} opacity={0.8}>
                      {description}
                    </ToastDescription>
                  ) : null}
                  
                  {actionLabel && onAction ? (
                    <Button
                      size="sm"
                      variant="outline"
                      mt="$2"
                      borderColor={getTextColor(variant)}
                      onPress={() => {
                        onAction();
                        toast.close(id);
                      }}
                      px="$3"
                    >
                      <ButtonText color={getTextColor(variant)}>{actionLabel}</ButtonText>
                    </Button>
                  ) : null}
                </VStack>
              </HStack>
              
              {showCloseButton && (
                <Pressable
                  onPress={() => toast.close(id)}
                  hitSlop={8}
                  p="$1"
                  borderRadius="$full"
                  backgroundColor="$backgroundLight100:alpha.30"
                >
                  <CloseIcon size="sm" color={getTextColor(variant)} />
                </Pressable>
              )}
            </HStack>
          </Toast>
        );
      },
    });
  };

  const closeToast = (id: string | number) => {
    toast.close(id);
  };

  const closeAllToasts = () => {
    toast.closeAll();
  };

  return (
    <ToastContext.Provider value={{ showToast, closeToast, closeAllToasts }}>
      {children}
    </ToastContext.Provider>
  );
};

// Enhanced custom hook with better error message
export const useAppToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAppToast must be used within a ToastProvider. Please make sure your component is wrapped with ToastProvider.");
  }
  return context;
};