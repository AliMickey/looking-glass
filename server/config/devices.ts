import { z } from 'zod';
import { COMMANDS, CommandConfig } from './commands';

// Device configuration schema
export const DeviceConfigSchema = z.object({
  host: z.string(),
  username: z.string(),
  password: z.string(),
  device_type: z.string(),
  description: z.string().optional(),
  enabled_commands: z.array(z.string()),
  location_id: z.string(),
});

export type DeviceConfig = z.infer<typeof DeviceConfigSchema>;

// Example device configurations
export const DEVICES: Record<string, DeviceConfig> = {
  'router1.chi': {
    host: '192.168.1.1',
    username: 'admin',
    password: 'secret',
    device_type: 'cisco_ios',
    description: 'Chicago Core Router 1',
    enabled_commands: ['ping', 'traceroute', 'bgp_path', 'bgp_route'],
    location_id: 'chi'
  },
  'router2.nyc': {
    host: '192.168.1.2',
    username: 'admin',
    password: 'secret',
    device_type: 'cisco_ios',
    description: 'New York Core Router 1',
    enabled_commands: ['ping', 'traceroute', 'mtr'],
    location_id: 'nyc'
  }
};

// Helper function to get available commands for a device
export function getDeviceCommands(deviceHost: string): CommandConfig[] {
  const device = DEVICES[deviceHost];
  if (!device) return [];
  
  return device.enabled_commands
    .map(cmdType => COMMANDS[cmdType])
    .filter((cmd): cmd is CommandConfig => cmd !== undefined);
}

// Validate device configurations
Object.entries(DEVICES).forEach(([deviceHost, config]) => {
  try {
    DeviceConfigSchema.parse(config);
    // Validate that all enabled commands exist in COMMANDS
    config.enabled_commands.forEach(cmdType => {
      if (!COMMANDS[cmdType]) {
        throw new Error(`Invalid command type "${cmdType}" for device "${deviceHost}"`);
      }
    });
  } catch (error) {
    console.error(`Invalid device configuration for "${deviceHost}":`, error);
    process.exit(1);
  }
});
