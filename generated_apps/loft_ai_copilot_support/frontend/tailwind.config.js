/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        loft: {
          orange: '#F56738',
          orangeHover: '#D94616',
          green: '#0B6B4F',
          dark: '#121619',
          surface: '#FFFFFF',
          bg: '#F2F4F8',
          border: '#E1E9EF',
          muted: '#627D98',
        },
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
