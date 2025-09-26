/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slateInk: "#2D1B0E",
        warmBeige: "#F7F3E9",
        softWood: "#D4C4A8",
        warmBrown: "#8B6F47",
        cream: "#F9F6F0",
        sageGreen: "#A8C09A",
        forestGreen: "#7A9B6B",
        mintCream: "#F2F6F0",
        summerBeige: "#F5F1E8",
        softSage: "#B8D4A8",
        lightMint: "#E8F4E6",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(45, 27, 14, 0.12)",
        wood: "0 8px 25px rgba(139, 111, 71, 0.15), inset 0 1px 0 rgba(212, 196, 168, 0.3)",
      },
      borderRadius: {
        '2xl': '1rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 400ms ease-out both',
      },
    },
  },
  plugins: [],
};


