import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(), // Keep the React plugin for Vite
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"), // Adjusted for new structure
    },
  },
  root: path.resolve(__dirname, "client"), // Updated root to the new location
  build: {
    outDir: path.resolve(__dirname, "dist", "public"), // Adjusted output directory
    emptyOutDir: true,
  },
});
