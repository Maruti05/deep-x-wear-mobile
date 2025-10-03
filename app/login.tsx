// LoginScreen.tsx
import {
  Box,
  Button,
  Center,
  Input,
  InputField,
  Spinner,
  Text,
  VStack
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { z } from "zod";
import { supabase } from "./lib/supabase"; // adjust path
import { getFriendlyErrorMessage } from "./lib/utils";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen({ navigation }: any) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      console.log("Login attempt", data);

      if (error) {
        console.log(error);
        throw error;
      }

      Alert.alert(
        "Welcome back!",
        "You are now logged in",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: true }
      );

      router.push("/index"); // redirect after login
    } catch (err: any) {
      Alert.alert(
        "Error",
        getFriendlyErrorMessage(err) || "Login failed",
        [{ text: "OK" }],
        { cancelable: true }
      );
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center flex={1} style={styles.screen}>
          <Box style={styles.container}>
            <Text style={styles.heading}>Welcome Back</Text>
            <Text style={styles.subheading}>Login to continue</Text>

            <VStack style={{ gap: 16 }}>
              {/* Email */}
              <Box>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <Input style={styles.input}>
                      <InputField
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={value}
                        onChangeText={onChange}
                      />
                    </Input>
                  )}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </Box>

              {/* Password */}
              <Box>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <Input style={styles.input}>
                      <InputField
                        placeholder="Password"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                      />
                    </Input>
                  )}
                />
                {errors.password && (
                  <Text style={styles.errorText}>
                    {errors.password.message}
                  </Text>
                )}
              </Box>

              {/* Login Button */}
              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || isSubmitting}
                style={styles.primaryButton}
              >
                {isSubmitting ? (
                  <Spinner color="white" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text> // Use Text instead of ButtonText
                )}
              </Button>

              {/* Link to Signup */}
              <Text style={styles.signupText}>
                Don’t have an account?{" "}
                <Text
                  style={styles.signupLink}
                  onPress={() => router.push("/signup")}
                >
                  Create Account
                </Text>
              </Text>
            </VStack>
          </Box>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff", // Black background
    paddingHorizontal: 24,
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: 400,
  },
  heading: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 18,
    textAlign: "center",
    color: "#111827",
  },
  subheading: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 14,
    fontWeight: "800",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  signupText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
    color: "#111827",
  },
  signupLink: {
    color: "#2563eb",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  toastSuccess: {
    backgroundColor: "#22c55e",
    padding: 12,
    borderRadius: 8,
  },
  toastError: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
  },
  toastTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  toastMessage: {
    color: "white",
    fontSize: 13,
  },
});
