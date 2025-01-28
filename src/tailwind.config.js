/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Specifies the files to scan for Tailwind CSS classes
  darkMode: 'class', // Enables dark mode using the 'class' strategy
  theme: {
    extend: {
      colors: {
        // You can customize your dark mode colors here
        dark: {
          DEFAULT: '#1a1a1a', // Default dark color
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
      },
    },
  },
  plugins: [], // Add Tailwind CSS plugins here
};
