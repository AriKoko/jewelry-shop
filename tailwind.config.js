/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4ead95', // ירוק-תכלת בהיר
          DEFAULT: '#2c8678', // ירוק בינוני
          dark: '#1e5e54', // ירוק כהה
          800: '#1e5e54', // תואם את dark
        },
        secondary: {
          light: '#a8c9a7', // ירוק-אפור בהיר
          DEFAULT: '#729d71', // ירוק אפרפר
          dark: '#537552', // ירוק אפרפר כהה
          800: '#537552', // תואם את dark
        },
        accent: {
          light: '#e3eedb', // ירוק-לבן בהיר מאוד
          DEFAULT: '#c6deb1', // ירוק-בז' בהיר
          dark: '#87a878', // ירוק-בז' כהה יותר
        },
      },
      fontFamily: {
        sans: ['Heebo', 'sans-serif'],
        fancy: ['Dancing Script', 'cursive'],
        title: ['Amatic SC', 'cursive'],
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
} 