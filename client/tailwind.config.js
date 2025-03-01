/** @type {import('tailwindcss').Config} */
import flowbitePlugin from 'flowbite/plugin'; // Import the flowbite plugin
import tailwindScrollbar from 'tailwind-scrollbar'; // Import the tailwind-scrollbar plugin

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  plugins: [
    flowbitePlugin, 
    tailwindScrollbar, 
  ],
};