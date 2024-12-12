import { DeviceConfig } from "@/lib/types";

export const LOCATIONS = [
  {
    id: "chi",
    city: "Chicago, IL",
    code: "US-CHI",
    shortCode: "CI",
    deviceHost: "router1.chi"
  },
  {
    id: "nyc",
    city: "New York, NY",
    code: "US-NYC", 
    shortCode: "NN",
    deviceHost: "router2.nyc"
  }
];

// Device configurations are now loaded from YAML through config_loader.py
// This is kept for type compatibility, actual device configs come from devices.ts
export const DEVICES: Record<string, DeviceConfig> = {
  "router1.chi": {
    host: "192.168.1.1",
    username: "admin",
    password: process.env.DEVICE_PASSWORD || "admin",
    device_type: "cisco_ios"
  },
  "router2.nyc": {
    host: "192.168.1.2",
    username: "admin",
    password: process.env.DEVICE_PASSWORD || "admin", 
    device_type: "cisco_ios"
  }
};
