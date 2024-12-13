import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  root: "./client",
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
    port: PORT,
    host: "0.0.0.0", // Required for Cloud Run
    strictPort: true, // Fail if port is in use
    hmr: isProd ? false : {
      port: parseInt(process.env.VITE_HMR_PORT || '24678', 10),
      host: '0.0.0.0',
      protocol: 'ws',
      clientPort: PORT // Use same port as server in Cloud Run
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
