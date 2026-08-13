module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFC",
        green: "#7cb518",
        darkGreen: "#1c7c54",
        orange: "#fb6107",
        lightYellow: "#f3de2c",
        yellow: "#fbb02d",
        deepDarkGreen:"#196143",
        "mugin-primary": "#FF7043",
        "mugin-accent": "#FFB703",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};