import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  root: "./client",
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
    copyPublicDir: true,
    minify: mode === 'production' ? 'terser' : false,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'wouter']
        }
      }
    }
  },
  server: {
    port: PORT,
    host: "0.0.0.0",
    strictPort: true,
    hmr: {
      clientPort: mode === 'production' ? 443 : PORT,
      port: PORT,
      host: process.env.VITE_HMR_HOST || "0.0.0.0"
    }
  },
  preview: {
    port: PORT,
    host: "0.0.0.0",
    strictPort: true
  },
  clearScreen: false,
  logLevel: mode === 'production' ? 'error' : 'info',
  define: {
    __PORT__: PORT
  }
}));
