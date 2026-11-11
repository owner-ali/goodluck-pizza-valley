export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { coal: '#0d0c0b', ember: '#ff6a1a', frost: '#38e8ff', champagne: '#e8d3a2' },
    fontFamily: { display: ['"Playfair Display"', 'serif'], sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'] },
  } },
}
