export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    // Premium palette: black + gold. "frost" is a soft ice tone used only in the Ice Bar.
    colors: { coal: '#08070a', ember: '#d4af37', frost: '#9fd8e8', champagne: '#f2e2b0', violet: '#6f8fa8' },
    fontFamily: { display: ['"Playfair Display"', 'serif'], sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'] },
  } },
}
