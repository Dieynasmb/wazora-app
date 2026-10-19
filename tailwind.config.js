/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2A24",
        inkSoft: "#24352D",
        paper: "#F6F2E8",
        paperDim: "#EDE7D8",
        line: "#E1D9C4",
        muted: "#7A7263",
        gold: "#C6862B",
        goldLight: "#E0A94E",
        goldSoft: "#F0DDB8",
        green: "#3F8F5C",
        greenSoft: "#DCEEE1",
        amber: "#D9A441",
        amberSoft: "#FBEED1",
        violet: "#8A5FBF",
        violetSoft: "#EAE1F5",
        blue: "#3B6FA0",
        blueSoft: "#DEE9F3",
        rose: "#C1543A",
        roseSoft: "#F6DED8",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["IBM Plex Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}