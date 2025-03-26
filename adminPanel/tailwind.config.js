module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}", // Add your file extensions here
  ],
  theme: {
    extend: {
      screens: {
        'sm': '525px', // Custom breakpoint
      },
      colors: {
        primary: '#e43131',
        main: '#181818',
        footerColor: '#121820',
        secondary: '#4d4e4f',
        secondary_2: '#a0a0a0',
        white: '#fff',
        surface: '#eff2f6',
        critical: '#f03e3e',
        warning: '#9391e1',
        success: '#3dab25',
        rowColor: '#f6f8fb',
        line: '#e9e9e9',
        pink: '#ec749d',
        blue: '#0c74d6',
        lightGray: '#cbd5e1',
        lightBlue: '#f2f7fb',
        main_rgba_1: 'rgba(0, 0, 0, .16)',
        main_rgba_2: 'rgba(0, 0, 0, .15)',
        gradient: 'linear-gradient(87deg, #fbf1f1 3.59%, #f4f1fa 95.02%)',
        rgba_primary: 'rgba(228, 49, 49, .1)',
        bg_scrollbar_track: '#f1f1f1',
        bg_scrollbar_thumb: '#c1c1c1',
        shadow1: '0px 10px 25px 0px #2b344a1f',
        shadow2: '0px 5px 18px 5px #40485726',
        backdrop: 'hsla(0, 0%, 9%, .2)',
      },
      animation: {
        'spin-fast': 'spin-fast 3s linear infinite', 
        ping: 'ping 1s cubic-bezier(0, 0, .2, 1) infinite',
      },
      keyframes: {
        'spin-fast': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
      boxShadow: {
        'custom': '5px 5px 18px 5px rgba(64, 72, 87, .15)',
        'inset-orange': 'inset 0 0 0 1px #fbbc05',  
      },
    },
  },
  plugins: [],
}
