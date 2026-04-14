module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#3525cd",
        "primary-container": "#4f46e5",
        "secondary-container": "#2170e4",
        "surface": "#f7f9fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container-high": "#e6e8ea",
        "on-surface": "#191c1e",
        "on-surface-variant": "#464555",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "secondary": "#0058be",
        "tertiary-container": "#a44100",
        "secondary-fixed-dim": "#adc6ff",
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#3525cd",
        "primary-container": "#4f46e5",
        "secondary-container": "#2170e4",
        "surface": "#f7f9fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container-high": "#e6e8ea",
        "on-surface": "#191c1e",
        "on-surface-variant": "#464555",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "secondary": "#0058be",
        "tertiary-container": "#a44100",
        "secondary-fixed-dim": "#adc6ff",
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}