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
        'brand-blue': '#1E396E',
        'accent-red': '#E80101',
        'footer-dark': '#373737',
        'text-primary': '#1E1E1E',
        'text-secondary': '#555555',
        'brand-white': '#ffffff',
        'brand-gray': '#f5f5f7',
        'brand-black': '#111111',
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(135deg, #1E396E 0%, #35528A 50%, #5F7AB1 100%)',
        'blue-soft': 'linear-gradient(180deg, #F5F8FF 0%, #EAF0FA 100%)',
      }
    },
  },  
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms"), require("daisyui")],
};
export default config;
