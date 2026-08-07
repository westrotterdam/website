module.exports = {
  content: ["./layouts/**/*.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#E9672F',
          blue: '#D1E7FD',
          green: '#27422B',
          brown: '#5D372B',
          cream: '#FFECBA',
          'cream-light': '#FFF7E0',
          dark: '#110E0C',
        },
      },
      fontFamily: {
        title: ['"Inter"', 'sans-serif'],
        heading: ['Georgia', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
