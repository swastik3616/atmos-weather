module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'dashboard-bg': '#181E2A',
        'card-bg': '#232A3A',
        'accent': '#7B3FF2',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0AEC0',
      },
      borderRadius: {
        '3xl': '24px',
      },
      boxShadow: {
        'dashboard': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      fontFamily: {
        'dashboard': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}