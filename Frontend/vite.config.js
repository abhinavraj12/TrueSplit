import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 5000,
    host: true,
    open: true,
    cors: true
  },
  build: {
    outDir: path.resolve(__dirname, '../src/main/resources/static'),
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    emptyOutDir: true
  }
});