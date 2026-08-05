import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        additionalData: `
          @use 'sass:color';
          @use 'sass:math';
          @use "${fileURLToPath(new URL('./src/styles/_vars.scss', import.meta.url))}" as *;
        `,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        fr: path.resolve(__dirname, 'fr/index.html'),
      },
    },
  },
});
