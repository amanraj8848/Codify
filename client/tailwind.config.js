module.exports = {
  // ... other configurations
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: 0.2 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  // ... other configurations
}
