/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-base': 'rgba(255, 255, 255, 0.35)',
        'neo-dark': 'rgba(163, 177, 198, 0.4)',
        'neo-light': 'rgba(255, 255, 255, 0.8)',
      },
      boxShadow: {
        'neo-outset': '6px 6px 16px rgba(163, 177, 198, 0.4), -6px -6px 16px rgba(255, 255, 255, 0.8)',
        'neo-inset': 'inset 4px 4px 8px rgba(163, 177, 198, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.7)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
}
