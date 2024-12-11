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
    id: "lax",
    city: "Los Angeles, CA", 
    code: "US-LAX",
    shortCode: "LC",
    deviceHost: "router1.lax"
  },
  {
    id: "nyc",
    city: "New York, NY",
    code: "US-NYC", 
    shortCode: "NN",
    deviceHost: "router1.nyc"
  }
];

export const DEVICES: Record<string, DeviceConfig> = {
  "router1.chi": {
    host: "192.168.1.1",
    username: "admin",
    password: process.env.DEVICE_PASSWORD || "admin",
    device_type: "cisco_ios"
  },
  "router1.lax": {
    host: "192.168.1.2",
    username: "admin", 
    password: process.env.DEVICE_PASSWORD || "admin",
    device_type: "cisco_ios"
  },
  "router1.nyc": {
    host: "192.168.1.3",
    username: "admin",
    password: process.env.DEVICE_PASSWORD || "admin", 
    device_type: "cisco_ios"
  }
};
