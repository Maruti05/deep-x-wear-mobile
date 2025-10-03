import {
  Box,
  Button,
  ButtonText,
  Input,
  InputField,
  Spinner,
  Text,
  VStack,
  useToast
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { z } from "zod";
import { supabase } from "./lib/supabase"; // adjust path

/* ------------------ Validation ------------------ */
const signupSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup({ navigation }: any) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setLoading(true);

      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { display_name: data.full_name } },
      });

      if (authError) throw authError;

      toast.show({
        placement: "top",
        render: () => (
          <Box style={styles.successToast}>
            <Text style={styles.toastTitle}>Account created successfully!</Text>
            <Text style={styles.toastMessage}>
              Please check your email to verify your account.
            </Text>
          </Box>
        ),
      });

      navigation.navigate("Login");
    } catch (err: any) {
      toast.show({
        placement: "top",
        render: () => (
          <Box style={styles.errorToast}>
            <Text style={styles.toastTitle}>Error</Text>
            <Text style={styles.toastMessage}>
              {err.message || "Failed to create account"}
            </Text>
          </Box>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{display:"flex", flex: 1, backgroundColor: "#f9fafb" ,height: '100%'}}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 ,height: '100%'}}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Box style={styles.card}>
            <Text style={styles.title}>Create An Account</Text>

            <VStack style={{ gap: 16 }}>
              {/* Full Name */}
              <Box>
                <Controller
                  control={control}
                  name="full_name"
                  render={({ field: { onChange, value } }) => (
                    <Input style={styles.input}>
                      <InputField
                        placeholder="Full Name"
                        value={value}
                        onChangeText={onChange}
                      />
                    </Input>
                  )}
                />
                {errors.full_name && (
                  <Text style={styles.errorText}>
                    {errors.full_name.message}
                  </Text>
                )}
              </Box>

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

              {/* Sign Up Button */}
              <Button
                style={styles.button}
                disabled={!isValid || loading}
                onPress={handleSubmit(onSubmit)}
              >
                {loading ? (
                  <Spinner color="white" />
                ) : (
                  <ButtonText style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
                    Sign Up
                  </ButtonText>
                )}
              </Button>

              {/* Link to Login */}
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text
                  style={styles.loginLink}
                  onPress={() => router.push("/login")}
                >
                  Log in here
                </Text>
              </Text>
            </VStack>
          </Box>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    minHeight: "60%", // adjust (60-80%) for full height feel
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 6,
    display: "flex",
   flex: 1,
    justifyContent: "center",
    
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 24,
    textAlign: "center",
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
   backgroundColor: "#111827",
    alignItems: "center",
    
  },
  errorText: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 4,
  },
  successToast: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorToast: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  toastTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  toastMessage: {
    color: "white",
    fontSize: 14,
  },
  loginText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: "#4b5563",
  },
  loginLink: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
