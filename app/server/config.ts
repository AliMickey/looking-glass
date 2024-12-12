import { loadConfig, getDeviceCommands } from './config/loader';

// Load configurations directly from YAML files
const { commands: COMMANDS, devices: DEVICES, uiConfig: UI_CONFIG } = loadConfig();

export const LOCATIONS = [
  {
    id: "chi",
    deviceName: "Chicago Core Router 1",
    subtext: "Chicago, IL",
    deviceHost: "router1.chi"
  },
  {
    id: "nyc",
    deviceName: "New York Core Router 1",
    subtext: "New York, NY",
    deviceHost: "router2.nyc"
  }
];

export { COMMANDS, DEVICES, UI_CONFIG, getDeviceCommands };
