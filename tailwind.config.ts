import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
         dark: {
          50: '#1a1a1a',
          100: '#2d2d2d',
          200: '#404040',
          300: '#525252',
          400: '#737373',
          500: '#a3a3a3',
          600: '#d4d4d4',
          700: '#e5e5e5',
          800: '#f5f5f5',
          900: '#ffffff',
        }
      },
    },
  },
  safelist: [
    // Appointment type colors
    'bg-blue-100', 'border-blue-400', 'dark:bg-blue-900', 'dark:border-blue-400',
    'bg-green-100', 'border-green-400', 'dark:bg-green-900', 'dark:border-green-400',
    'bg-orange-100', 'border-orange-400', 'dark:bg-orange-900', 'dark:border-orange-400',
    'bg-purple-100', 'border-purple-400', 'dark:bg-purple-900', 'dark:border-purple-400',
    'bg-gray-100', 'border-gray-300', 'dark:bg-gray-800', 'dark:border-gray-600'
  ],

  plugins: [],
};
export default config;
