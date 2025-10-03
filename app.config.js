import "dotenv/config";

export default {
  expo: {
    name: "deep-x-wear-mobile",
    slug: "deep-x-wear-mobile",
    scheme: "deep-x-wear-mobile",
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
    plugins: ["expo-secure-store", "expo-router", "expo-web-browser"],
  },
};
