import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  // Only use /SharlOS/ base path when explicitly building for GitHub Pages
  // Use environment variable GITHUB_PAGES=true for deployment builds
  base: process.env.GITHUB_PAGES === 'true' ? '/SharlOS/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
  },
}));