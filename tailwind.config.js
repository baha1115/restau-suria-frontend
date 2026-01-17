// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.06)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        },
        "soft-pulse": {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: 0.85 }
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        }
      },
      animation: {
        "fade-up": "fade-up .5s ease-out both",
        "fade-in": "fade-in .35s ease-out both",
        float: "float 3.2s ease-in-out infinite",
        "soft-pulse": "soft-pulse 2.4s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite"
      }
    }
  },
  plugins: []
};
