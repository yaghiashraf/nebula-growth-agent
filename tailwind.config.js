/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode palette as specified
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937', // surface
          900: '#111827', // base
        },
        // Accent gradient colors
        accent: {
          from: '#6366f1', // indigo-400
          to: '#8b5cf6',   // violet-500
        },
        // Semantic colors for dark mode
        background: {
          DEFAULT: '#ffffff',
          dark: '#111827',
        },
        surface: {
          DEFAULT: '#f9fafb',
          dark: '#1f2937',
        },
        primary: {
          DEFAULT: '#6366f1',
          dark: '#818cf8',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          dark: '#a78bfa',
        },
        text: {
          DEFAULT: '#111827',
          secondary: '#6b7280',
          dark: '#f9fafb',
          'dark-secondary': '#d1d5db',
        },
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#374151',
        },
        success: {
          DEFAULT: '#10b981',
          dark: '#34d399',
        },
        warning: {
          DEFAULT: '#f59e0b',
          dark: '#fbbf24',
        },
        error: {
          DEFAULT: '#ef4444',
          dark: '#f87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.15)',
        'inner-glow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // Removed forms and typography plugins for simplified deployment
    // Custom plugin for dark mode utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.text-gradient': {
          'background-image': 'linear-gradient(45deg, #6366f1, #8b5cf6)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.bg-gradient-primary': {
          'background-image': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        },
        '.glass-effect': {
          'backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.dark .glass-effect': {
          'background-color': 'rgba(0, 0, 0, 0.3)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};