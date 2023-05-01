/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // darkMode: 'media',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
    './page-tabs/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    'grid-cols-7',
    'grid-cols-8',
    'grid-cols-9',
  ],
  theme: {
    fontSize: {
      xxs: '.6rem',
      xs: '.75rem',
      sm: '.875rem',
      tiny: '.9rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.375rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3.4375rem',
      '6xl': '4.125rem',
      '7xl': '5rem',
      '--40': '2.375rem',
      1.625: '1.625rem',
    },
    fontWeight: {
      hairline: 100,
      'extra-light': 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      'extra-bold': 800,
      black: 900,
    },
    extend: {
      dropShadow: { premium: '0 0 .75rem rgb(63,133,224)' },
      borderColor: { DEFAULT: 'hsla(0, 0%, 73%, 0.25)' },
      colors: {
        xpBlue: {
          DEFAULT: '#6767EA',
          premium: '#3f85e0',
        },
        lightText: { DEFAULT: '#f5f5f7', darkMode: '' },
        darkText: { DEFAULT: '#1d1d1f', darkMode: '#f5f5f7' },
        wavePage: {
          DEFAULT: '#F2F3F7',
          darkMode: '#1C1C1D',
        },
        panelBack: {
          DEFAULT: 'white',
          darkMode: '#2C2C2D',
        },
        input: {
          DEFAULT: '#F9F9F9',
          darkMode: '#3f3f41',
          border: {
            DEFAULT: 'rgba(152, 152, 152, .25)',
            darkMode: '',
          },
        },
        navBar: {
          mobile: {
            background: {
              DEFAULT: 'rgba(248, 248, 248, 1)',
              darkMode: 'rgba(18, 18, 18, 1)',
            },
            icons: { enabled: '#4D5CD1', disabled: '#808080' },
          },
        },
        button: {
          red: {
            DEFAULT: `#D84D5E`,
            darkMode: `#D84D5E`,
            pressed: { DEFAULT: `#fa6375`, darkMode: `#fa6375` },
          },
          green: {
            DEFAULT: `#4c8f42`,
            darkMode: `#4c8f42`,
            pressed: { DEFAULT: `#6ba163`, darkMode: `#6ba163` },
          },
          arrow: '#C5C5C7',
          state: {
            pressed: { DEFAULT: 'rgb(229, 231, 235)', darkMode: '#3A3A3B' },
          },
        },
      },
      spacing: {
        112: '28rem',
        128: '32rem',
        144: '36rem',
      },
      width: {
        'screen/2': '50vw',
        'screen-3/4': '75vw',
      },
      height: {
        'screen/2': '50vh',
        header: '275px',
      },
      screens: {
        tiny: '300px',
        sm: '330px',
        '2sm': '450px',
        md: '728px',
        lg: '900px',
        xl: '1180px',
      },
      container: {
        center: true,
        screens: {
          sm: '330px',
          '2sm': '450px',
          md: '728px',
          lg: '900px',
          xl: '1180px',
        },
      },
      boxShadow: {
        md: ['0px 4px 10px rgba(0, 0, 0, 0.05)'],
        rankingAvater: ['0 0 0 8px #0000000f'],
        premium: ['0 0 0 8px #0000000f'],
        input: ['inset 0px 0px 10px -5px rgba(0, 0, 0, .25) !important'],
      },
      maxHeight: {
        'screen/2': '50vh',
      },
      fontFamily: {
        montserrat: ['Montserrat'],
        roboto: [`Roboto`],
        inter: [`var(--inter-font)`],
        WhitneySemibold: [`Whitney Semibold`],
      },
      backgroundImage: () => ({
        // header: 'url(/age3.svg)',
      }),
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        wiggle: {
          '0%, 100%': {
            transform: 'rotate(-3deg)',
          },
          '50%': {
            transform: 'rotate(3deg)',
          },
        },
        wiggleReverse: {
          '0%, 100%': {
            transform: 'rotate(3deg)',
          },
          '50%': {
            transform: 'rotate(-3deg)',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 200ms ease-out',
        fadeOut: 'fadeOut 200ms ease-out',
        wiggle: 'wiggle 8s ease-in-out infinite',
        wiggleReverse: 'wiggleReverse 8s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-hyphens'), // Removed line clamp as it is already there
    require('tailwindcss-safe-area'),
    require('./custom-tailwind/tailwind-ios-selector'),
  ],
};
