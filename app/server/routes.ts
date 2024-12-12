import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { LOCATIONS } from "./config";
import { executeCommand } from "./device";
import { getConfig, getDeviceCommands } from "./config";

const { commands, devices } = getConfig();

interface ExecuteQueryParams {
  locationId?: string;
  command?: string;
  target?: string;
}

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Configure for external access
  app.set("trust proxy", 1);

  app.get("/api/locations", (_req: Request, res: Response) => {
    res.json(LOCATIONS);
  });

  app.get("/api/device/:deviceHost/commands", (req: Request, res: Response) => {
    const { deviceHost } = req.params;
    const availableCommands = getDeviceCommands(devices, commands, deviceHost);
    res.json(availableCommands);
  });

  app.get("/api/execute", async (req: Request<{}, any, any, ExecuteQueryParams>, res: Response) => {
    const { locationId, command, target } = req.query;

    if (!locationId || !command || !target) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const location = LOCATIONS.find((l) => l.id === locationId);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    try {
      const output = await executeCommand(
        location.deviceHost,
        command,
        target
      );
      res.json({ output });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Add a health check endpoint for Docker
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  return httpServer;
}
