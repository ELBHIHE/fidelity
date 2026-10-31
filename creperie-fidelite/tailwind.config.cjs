module.exports = {
  content: ['./client/**/*.{html,js}', './caisse/**/*.{html,js}', './admin/**/*.{html,js}'],
  safelist: ['s','on','last','fait','rec','oui','non','ok','err','chip','mini','wa','av','nom','vide'],
  theme: { extend: {
    colors: { canvas:'#f5f6f8', ink:'#1f2937', mute:'#667085', line:'#e0e4ea', navy:'#16253b',
      brand:{ DEFAULT:'#0f766e', 50:'#ecf6f4', 700:'#0b5c56' } },
    fontFamily: { sans: ['"IBM Plex Sans"','system-ui','sans-serif'] } } },
  plugins: []
};
