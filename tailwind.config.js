/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,jpg}",
  ],
  theme: {
    extend: {boxShadow: {
      customShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Customize this as per your needs
    },
},
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    // other plugins...
  ],
}

