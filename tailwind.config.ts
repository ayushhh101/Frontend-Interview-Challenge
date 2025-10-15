import type { Config } from 'tailwindcss';

const config: Config = {
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
      },
    },
  },
  safelist: [
    // Appointment type colors
    'bg-blue-100', 'border-blue-400',
    'bg-green-100', 'border-green-400',
    'bg-orange-100', 'border-orange-400',
    'bg-purple-100', 'border-purple-400',
    'bg-gray-100', 'border-gray-300'
  ],
  
  plugins: [],
};
export default config;
