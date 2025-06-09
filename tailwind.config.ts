import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}', 
    './components/*.{ts,tsx}', 
    './src/**/*.{ts,tsx}' // Adicione se seu projeto usa pasta src
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: '0.5rem',
        tiny: '0.7rem',
      },
    },
  },
  plugins: [],
};

export default config;