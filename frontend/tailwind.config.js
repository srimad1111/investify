/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Legacy fintech colors (to be phased out)
        fintech: {
          dark: '#000000',
          card: '#0A0A0A',
          border: '#1A1A1A',
          text: '#B7BDC6',
          green: '#0ECB81',
          red: '#F6465D',
          primary: '#2962FF'
        },
        // New Institutional Intelligence colors
        "secondary-fixed": "#d3e4fe",
        "on-primary-fixed": "#001452",
        "primary-container": "#0052ff",
        "primary-fixed-dim": "#b7c4ff",
        "secondary-container": "#3a4a5f",
        "surface-dim": "#101415",
        "secondary": "#b7c8e1",
        "surface-bright": "#363a3b",
        "inverse-on-surface": "#2d3133",
        "tertiary-container": "#5e667d",
        "tertiary-fixed-dim": "#bec6e0",
        "on-error": "#690005",
        "on-tertiary-container": "#dde4ff",
        "on-primary-container": "#dfe3ff",
        "surface-tint": "#b7c4ff",
        "inverse-primary": "#004ced",
        "on-secondary": "#213145",
        "surface": "#101415",
        "secondary-fixed-dim": "#b7c8e1",
        "on-primary-fixed-variant": "#0038b6",
        "tertiary-fixed": "#dae2fd",
        "outline-variant": "#434656",
        "surface-container-high": "#272a2c",
        "on-tertiary-fixed": "#131b2e",
        "error": "#dc2626",
        "on-secondary-fixed-variant": "#38485d",
        "on-background": "#e0e3e5",
        "surface-variant": "#323537",
        "on-tertiary-fixed-variant": "#3f465c",
        "on-error-container": "#ffdad6",
        "surface-container-lowest": "#0b0f10",
        "surface-container": "#1d2022",
        "on-secondary-container": "#a9bad3",
        "on-surface-variant": "#c3c5d9",
        "outline": "#8d90a2",
        "primary-fixed": "#dde1ff",
        "on-surface": "#e0e3e5",
        "on-tertiary": "#283044",
        "error-container": "#93000a",
        "primary": "#0052ff",
        "inverse-surface": "#e0e3e5",
        "on-primary": "#ffffff",
        "tertiary": "#bec6e0",
        "surface-container-highest": "#323537",
        "surface-container-low": "#191c1e",
        "background": "#101415",
        "on-secondary-fixed": "#0b1c30"
      },
      spacing: {
        "container-max": "1440px",
        "gutter": "20px"
      },
      fontFamily: {
        "headline-lg": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "data-mono": ["Inter", "sans-serif"],
        "label-caps": ["Work Sans", "sans-serif"],
        "headline-xl": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"]
      },
      fontSize: {
        "headline-lg": ["24px", {"lineHeight": "1.3", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "body-sm": ["13px", {"lineHeight": "1.4", "fontWeight": "400"}],
        "data-mono": ["14px", {"lineHeight": "1.0", "fontWeight": "500"}],
        "label-caps": ["11px", {"lineHeight": "1.0", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "headline-xl": ["36px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "body-md": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-md": ["18px", {"lineHeight": "1.4", "fontWeight": "600"}]
      }
    },
  },
  plugins: [],
}
