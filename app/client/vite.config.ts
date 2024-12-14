import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
    sourcemap: true,
    target: 'esnext',
    modulePreload: {
      polyfill: false
    }
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    hmr: isProd ? false : {
      port: 24678,
      host: '0.0.0.0',
      protocol: 'ws'
    }
  },
  preview: {
    port: PORT,
    host: "0.0.0.0",
    strictPort: true
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  },
  clearScreen: false,
  logLevel: "info"
});
