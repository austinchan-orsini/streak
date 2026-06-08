export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#F8F1E4',
        card: '#FFFFFF',
        panel: '#F1EADC',
        ink: '#3F3326',
        dim: '#8C7F6D',
        hair: 'rgba(63,51,38,0.10)',
        lime: '#C6E89E',
        limeDeep: '#A8D278',
        orange: '#FFCBA8',
        blue: '#BACEF1',
        pink: '#F4C7D2',
        lilac: '#D9C7E8',
        terracotta: '#E8A48E',
      },
      boxShadow: {
        card: '0 1px 0 rgba(63,51,38,0.04), 0 2px 8px rgba(63,51,38,0.04)',
        lifted: '0 4px 20px rgba(63,51,38,0.18)',
      },
    },
  },
  plugins: [],
};
