/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          50: '#f7f5f3',
          100: '#ede8e3',
          200: '#ddd4c7',
          300: '#c8b8a3',
          400: '#b39c7d',
          500: '#a08660',
          600: '#937654',
          700: '#7a6147',
          800: '#65513e',
          900: '#544335',
        },
        forest: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8fd18f',
          400: '#5cb85c',
          500: '#3a9b3a',
          600: '#2d7d2d',
          700: '#256325',
          800: '#1f4f1f',
          900: '#1a421a',
        },
        sage: {
          50: '#f6f7f4',
          100: '#e9ebe4',
          200: '#d4d8ca',
          300: '#b8c0a7',
          400: '#9ba587',
          500: '#7f8a6b',
          600: '#646d54',
          700: '#505744',
          800: '#424639',
          900: '#383c31',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}