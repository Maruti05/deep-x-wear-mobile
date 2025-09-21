import { createConfig } from '@gluestack-style/react'

export const config = createConfig({
  aliases: {
    bg: "backgroundColor",
    p: "padding",
    m: "margin",
  },
  tokens: {
    colors: {
      primary: "#4f46e5",
      secondary: "#06b6d4",
      background: "#f9fafb",
    },
    space: {
      sm: 8,
      md: 16,
      lg: 24,
    },
    fontSizes: {
      sm: 14,
      md: 16,
      lg: 20,
    },
  },
})
