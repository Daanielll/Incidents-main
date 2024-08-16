/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#1A1A1B",
        "secondary-text": "#606876",
        border: "#E4E5E9",
        light: "#F4F4F4",
        "white-color": "#fff",
        "primary-hover": "#0061DE",
        primary: "#006FFF",
        "primary-light": "#77B2FF",
        "primary-lightest": "#E1EEFF",
        "secondary-green": "#5BCB60",
        "secondary-yellow": "#FFCA63",
        "secondary-red": "#EE4D4D",
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
};
