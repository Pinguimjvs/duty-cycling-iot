/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B132B',
          800: '#1C2541',
          700: '#3A506B',
        },
        brand: {
          teal: '#0D9488',
          blue: '#2563EB',
          orange: '#EA580C',
          green: '#16A34A',
        }
      }
    },
  },
  plugins: [],
}
