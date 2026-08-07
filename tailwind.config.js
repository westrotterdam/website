module.exports = {
  content: ["./layouts/**/*.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#642F32',
          blue: '#BED3DB',
          olive: '#8A843D',
          sand: '#CDB684',
          'cream-light': '#FFF7E0',
          dark: '#110E0C',
        },
      },
      fontFamily: {
        title: ['"Inter Black"', 'sans-serif'],
        heading: ['Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
      },
    },
  },
  plugins: [],
}
