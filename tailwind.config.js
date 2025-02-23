/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'serif-heading': ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'], // Elegant serif for headings
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'], // Default sans-serif
      },
      colors: {
        // You can customize your dark mode colors here
        dark: {
          DEFAULT: '#1a1a1a',
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
        accent: { // Teal color palette
          50: '#f0fdfa',
          100: '#e0fcec',
          200: '#bef2f0',
          300: '#8eeef0',
          400: '#5ee7df',
          500: '#34d3c9',
          600: '#2dd4bf',
          700: '#25c2a8',
          800: '#16a38a',
          900: '#0f766e',
          950: '#083344',
        },
      },
      fontFamily: {
        'serif-heading': ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
        'heading': ['"serif-heading"', 'serif'], // Apply serif-heading to 'heading' class
      },
    },
  },
  plugins: [],
};
