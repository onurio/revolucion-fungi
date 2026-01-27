import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./static/**/*.{tsx,ts,jsx,js,html}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
