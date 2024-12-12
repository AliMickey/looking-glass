import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Babel configuration for better JSX handling
      babel: {
        plugins: [
          ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
    // Ensure proper module resolution
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  root: "./client",
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
    copyPublicDir: true,
    // Improve production build
    minify: 'terser',
    sourcemap: true,
    // Configure chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'wouter',
            '@tanstack/react-query'
          ]
        }
      }
    }
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    host: process.env.HOST || "0.0.0.0",
    // Add better error handling
    hmr: {
      overlay: true
    }
  },
  // Add better error handling during build
  clearScreen: false,
  logLevel: 'info'
});
