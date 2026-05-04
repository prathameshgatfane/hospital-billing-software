export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#DC2626",
        primaryDark: "#B91C1C",
        dark: "#0F0F0F",
        grayText: "#1F2937",
        lightBg: "#F3F4F6",
        charcoal: "#212121",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%': { transform: 'translateY(-20px) rotate(-3deg)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-out forwards',
        'slide-in-left': 'slide-in-left 1s ease-out forwards',
      }
    },
  },
  plugins: [],
}