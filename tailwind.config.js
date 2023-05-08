/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}', // Note the addition of the `app` directory.
    './src/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: "#fff",
      black: '#131313',
      gray1: "rgba(0, 0, 0, 0.02)",
      gray2: "#C3BBBB",
      colorborder1: "#E1E4E8",
      colorborder2: "#d9d9d9",
      colorborder3: "#FBF6F6",
    },
    boxShadow: {
      DEFAULT: "0px 1px 3px rgba(0, 0, 0, 0.2)",
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0px 0px 3px rgba(0, 0, 0, 0.2)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none',
    },
    extend: {
      backgroundImage: {
        'box-1': 'linear-gradient(90deg, #FCF6FA 0%, #FFFEFF 97.44%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
