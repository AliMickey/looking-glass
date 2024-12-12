import type { Express } from "express";
import { createServer, type Server } from "http";
import { LOCATIONS } from "./config";
import { executeCommand } from "./device";
import { getConfig, getDeviceCommands } from "./config";

const { commands, devices } = getConfig();

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  app.get("/api/locations", (_req, res) => {
    res.json(LOCATIONS);
  });
  app.get("/api/device/:deviceHost/commands", (req, res) => {
    const { deviceHost } = req.params;
    const availableCommands = getDeviceCommands(devices, commands, deviceHost);
    res.json(commands);
  });

  app.get("/api/execute", async (req, res) => {
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
        command as string,
        target as string,
      );
      res.json({ output });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  });

  return httpServer;
}
