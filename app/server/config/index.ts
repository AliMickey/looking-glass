import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { z } from 'zod';
import path from 'path';

// Zod schemas for type validation
export const CommandSchema = z.object({
  type: z.string(),
  label: z.string(),
  template: z.string(),
  description: z.string().optional(),
  subType: z.enum(['path', 'community', 'route']).optional(),
  inputPlaceholder: z.string()
});

export const DeviceSchema = z.object({
  host: z.string(),
  username: z.string(),
  password: z.string(),
  device_type: z.string(),
  description: z.string().optional(),
  enabled_commands: z.array(z.string()),
  location_id: z.string()
});

export const UIConfigSchema = z.object({
  branding: z.object({
    logo: z.object({
      light: z.string(),
      dark: z.string()
    }),
    header: z.object({
      title: z.string(),
      subtitle: z.string().optional()
    }),
    footer: z.object({
      text: z.string(),
      links: z.array(z.object({
        label: z.string(),
        url: z.string()
      })),
      contact: z.object({
        email: z.string(),
        phone: z.string()
      })
    })
  })
});

// Type definitions
export type Command = z.infer<typeof CommandSchema>;
export type Device = z.infer<typeof DeviceSchema>;
export type UIConfig = z.infer<typeof UIConfigSchema>;

// Simple function to load and validate YAML files
function loadYamlConfig<T>(filePath: string, schema: z.ZodSchema<T>): T {
  try {
    // Move up one directory from /app to get to project root where /config is
    const projectRoot = path.resolve(process.cwd(), '..');
    const configPath = path.join(projectRoot, 'config', filePath);
    console.log(`Loading config from: ${configPath}`);
    const fileContent = readFileSync(configPath, 'utf8');
    const parsed = parse(fileContent);
    return schema.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`Validation error in ${filePath}:`, error.errors);
    } else {
      console.error(`Error loading ${filePath}:`, error);
    }
    throw error;
  }
}

// Load configuration files
export function loadConfig() {
  try {
    console.log('Current working directory:', process.cwd());
    
    const commandsConfig = loadYamlConfig(
      'commands.yaml',
      z.object({ commands: z.record(CommandSchema) })
    );

    const devicesConfig = loadYamlConfig(
      'devices.yaml',
      z.object({ devices: z.record(DeviceSchema) })
    );

    const uiConfig = loadYamlConfig(
      'ui.yaml',
      UIConfigSchema
    );

    return {
      commands: commandsConfig.commands,
      devices: devicesConfig.devices,
      uiConfig,
    };
  } catch (error) {
    console.error('Error loading configuration:', error);
    // Provide default configurations for development
    return {
      commands: {},
      devices: {},
      uiConfig: {
        branding: {
          logo: { light: '', dark: '' },
          header: { title: 'Network Monitor' },
          footer: {
            text: '',
            links: [],
            contact: { email: '', phone: '' }
          }
        }
      }
    };
  }
}

// Helper function to get available commands for a device
export function getDeviceCommands(devices: Record<string, Device>, commands: Record<string, Command>, deviceHost: string): Command[] {
  const device = devices[deviceHost];
  if (!device) return [];
  
  return device.enabled_commands
    .map(cmdType => commands[cmdType])
    .filter((cmd): cmd is Command => cmd !== undefined);
}
