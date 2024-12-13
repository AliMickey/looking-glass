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

    // Get port from environment variable (required for Cloud Run) or use default
    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
    const HOST = "0.0.0.0"; // Always bind to all interfaces for Cloud Run

    try {
      // Ensure proper shutdown handling for Cloud Run
      const signals = ['SIGTERM', 'SIGINT'] as const;
      
      signals.forEach((signal) => {
        process.on(signal, () => {
          log(`Received ${signal}, shutting down gracefully`, 'server');
          server.close(() => {
            log('Server closed', 'server');
            process.exit(0);
          });
        });
      });

      server.listen(PORT, HOST, () => {
        log(`Server running at http://${HOST}:${PORT}`);
        log(`Environment: ${app.get("env")}`);
        log(`Process ID: ${process.pid}`);
        log(`Ready to handle requests`);
      });

      // Handle server errors
      server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.syscall !== 'listen') {
          throw error;
        }

        switch (error.code) {
          case 'EACCES':
            log(`Port ${PORT} requires elevated privileges`, 'error');
            process.exit(1);
            break;
          case 'EADDRINUSE':
            log(`Port ${PORT} is already in use`, 'error');
            process.exit(1);
            break;
          default:
            throw error;
        }
      });
    } catch (error) {
      log(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`, 'error');
      process.exit(1);
    }
  } catch (error) {
    log('Failed to start server:', error instanceof Error ? error.message : String(error));
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    process.exit(1);
  }
})();
