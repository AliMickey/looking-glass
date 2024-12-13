import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  try {
    const vite = await createViteServer({
      ...viteConfig,
      configFile: false,
      customLogger: {
        ...viteLogger,
        error: (msg, options) => {
          if (msg.includes("[TypeScript] Found 0 errors. Watching for file changes")) {
            log("no errors found", "tsc");
            return;
          }

          if (msg.includes("[TypeScript] ")) {
            const [errors, summary] = msg.split("[TypeScript] ", 2);
            log(`${summary} ${errors}\u001b[0m`, "tsc");
            return;
          }
          
          log(`Vite error: ${msg}`, "error");
          viteLogger.error(msg, options);
        },
      },
      server: {
        middlewareMode: true,
        hmr: {
          server,
          port: parseInt(process.env.VITE_HMR_PORT || '24678', 10),
          host: '0.0.0.0'
        },
        host: '0.0.0.0', // Always bind to all interfaces for Cloud Run
        port: parseInt(process.env.PORT || '8080', 10),
        strictPort: true, // Fail if port is in use
      },
      appType: "custom",
    });

    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;

      try {
        const clientTemplate = path.resolve(
          __dirname,
          "..",
          "client",
          "index.html",
        );

        // always reload the index.html file from disk incase it changes
        const template = await fs.promises.readFile(clientTemplate, "utf-8");
        const page = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } catch (error) {
    log(`Failed to setup Vite: ${error instanceof Error ? error.message : String(error)}`, "error");
    throw error;
  }
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "client");
  const indexPath = path.resolve(distPath, "index.html");

  if (!fs.existsSync(distPath)) {
    const err = new Error(`Build directory not found: ${distPath}. Please run 'npm run build' first.`);
    log(err.message, "error");
    throw err;
  }

  if (!fs.existsSync(indexPath)) {
    const err = new Error(`Index file not found: ${indexPath}. Client build may be incomplete.`);
    log(err.message, "error");
    throw err;
  }

  // Serve static files from the client build directory
  app.use(express.static(distPath, {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        // Cache assets for 1 day
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    },
  }));

  // Serve index.html for all other routes (SPA fallback)
  app.use("*", (_req, res) => {
    res.sendFile(indexPath);
  });
}
