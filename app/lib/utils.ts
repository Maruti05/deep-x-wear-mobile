import { AdditionalData } from "@/app/types/User";
// Slugify string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Discounted price calculation
export const getDiscountedPrice = (price: string | number, discount: number): number => {
  const numericPrice = Number(price);
  if (discount <= 0) return Math.round(numericPrice);

  const discounted = numericPrice - (numericPrice * discount) / 100;
  return Math.round(discounted);
};

// Friendly error messages
export function getFriendlyErrorMessage(error: any): string {
  switch (error.code) {
    case "23505":
      if (error.message.includes("users_email_unique")) {
        return "This email is already registered. Please use a different email.";
      }
      return "Duplicate value. Please use a different input.";
    case "23503":
      return "Invalid reference. Please check related data.";
    case "23502":
      return "Missing required field.";
    default:
      return error.message || "An unexpected error occurred.";
  }
}

// Verify required fields
type RequiredField = keyof Pick<
  AdditionalData,
  "phone_number" | "pin_code" | "state_name" | "user_address" | "city"
>;

export function verifyRequiredFieldsPresent(
  additionalData?: AdditionalData | null
): boolean {
  if (!additionalData || typeof additionalData !== "object") return false;

  const requiredFields: RequiredField[] = [
    "phone_number",
    "pin_code",
    "state_name",
    "user_address",
    "city",
  ];

  return requiredFields.every((field) => {
    const rawValue = additionalData[field];
    const value = String(rawValue ?? "").trim();
    return value.length > 0;
  });
}
