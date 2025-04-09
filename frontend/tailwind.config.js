/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#ff4f81',
            light: '#ff80ab',
            dark: '#c60055',
          },
          secondary: {
            DEFAULT: '#3f51b5',
            light: '#757de8',
            dark: '#002984',
          },
          background: '#f5f5f5',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        spacing: {
          '128': '32rem',
        },
      },
    },
    plugins: [],
  };