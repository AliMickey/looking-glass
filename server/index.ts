import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { watch } from "chokidar";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Set up config file watcher
const configDir = path.join(__dirname, "config");
const watcher = watch([
  path.join(configDir, "*.yaml"),
  path.join(configDir, "*.yml")
], {
  persistent: true,
  ignoreInitial: true
});

// Handler for YAML config changes
watcher.on('change', (path) => {
  log(`Config file changed: ${path}`);
  
  // Run config_loader.py to regenerate TypeScript files
  const configLoader = spawn('python3', ['server/config_loader.py']);
  
  configLoader.stdout.on('data', (data) => {
    log(`Config loader output: ${data}`);
  });
  
  configLoader.stderr.on('data', (data) => {
    log(`Config loader error: ${data}`);
  });
  
  configLoader.on('close', (code) => {
    if (code === 0) {
      log('TypeScript configs regenerated successfully');
    } else {
      log(`Config loader exited with code ${code}`);
    }
  });
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

(async () => {
  const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Get port from environment variable or default to 5000
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
