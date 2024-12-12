import { loadConfig, getDeviceCommands, type Command, type Device, type UIConfig } from './config/index';

// Load configurations from YAML files
const config = loadConfig();

// Export configuration and types
export const COMMANDS = config.commands;
export const DEVICES = config.devices;
export const UI_CONFIG = config.ui;

// Define locations based on device configurations
export const LOCATIONS = Object.entries(DEVICES).map(([host, device]) => ({
  id: device.location_id,
  deviceName: device.description || host,
  subtext: device.location_id.toUpperCase(),
  deviceHost: host
}));

// Re-export types and functions
export type { Command, Device, UIConfig };
export { getDeviceCommands };
export { loadConfig as getConfig };
