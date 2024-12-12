import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();

// Add basic error handling for configuration loading
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Initialize middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware for development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
}

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`, 'http');
  });

  next();
});

(async () => {
  try {
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

    // Get port and host from environment variables or use defaults
    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    const HOST = process.env.HOST || "0.0.0.0";

    try {
      server.listen(PORT, HOST, () => {
        log(`Server running at http://${HOST}:${PORT}`);
        log(`Environment: ${app.get("env")}`);
      });
    } catch (error) {
      log(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  } catch (error) {
    log('Failed to start server:', error instanceof Error ? error.message : String(error));
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    process.exit(1);
  }
})();
