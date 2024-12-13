import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

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
  },
  server: {
    port: parseInt(process.env.PORT || '8080', 10),
    host: "0.0.0.0", // Required for Cloud Run
    strictPort: false, // Allow fallback to other ports if needed
    hmr: {
      clientPort: parseInt(process.env.PORT || '8080', 10),
      port: parseInt(process.env.VITE_HMR_PORT || '24678', 10),
      host: '0.0.0.0'
    }
  },
  preview: {
    port: PORT,
    host: "0.0.0.0",
    strictPort: true
  },
  clearScreen: false,
  logLevel: "info"
});
