/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['"Noto Sans SC"', 'sans-serif'],
        display: ['Quicksand', '"Noto Sans SC"', 'sans-serif'],
      },
      colors: {
        status: {
          safe: '#22c55e',
          warning: '#eab308',
          danger: '#ef4444',
          expired: '#6b7280',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
        'pulse-slow': 'pulseSlow 2s ease-in-out infinite',
        'breathe': 'breathe 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
