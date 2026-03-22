import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        success: "var(--success)",
        danger: "var(--danger)",
        "card-bg": "var(--card-bg)",
        "card-border": "var(--card-border)",
        "nav-bg": "var(--nav-bg)",
        "input-bg": "var(--input-bg)",
        "input-border": "var(--input-border)",
      },
    },
  },
  plugins: [],
};
export default config;
