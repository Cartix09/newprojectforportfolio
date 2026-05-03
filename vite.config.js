import { defineConfig } from 'vite';

// IMPORTANT: this base path matches the GitHub Pages repo URL.
// Live site is served at https://cartix09.github.io/newprojectforportfolio/
export default defineConfig({
  base: '/newprojectforportfolio/',
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
  },
});
