import yaml
from typing import Dict, List, Optional, TypedDict
import json
import os
from pathlib import Path

class CommandConfig(TypedDict):
    type: str
    label: str
    template: str
    description: Optional[str]
    subType: Optional[str]
    inputPlaceholder: str

class UIConfig(TypedDict):
    branding: Dict[str, Dict[str, str]]

class DeviceConfig(TypedDict):
    host: str
    username: str
    password: str
    device_type: str
    description: Optional[str]
    enabled_commands: List[str]
    location_id: str

def load_yaml_config(file_path: str) -> dict:
    if not Path(file_path).exists():
        raise FileNotFoundError(f"Configuration file not found: {file_path}")
    try:
        with open(file_path, 'r') as f:
            return yaml.safe_load(f)
    except Exception as e:
        raise Exception(f"Error loading {file_path}: {str(e)}")

def validate_command_config(cmd_config: dict, cmd_id: str) -> None:
    required_fields = ['type', 'label', 'template', 'inputPlaceholder']
    for field in required_fields:
        if field not in cmd_config:
            raise ValueError(f"Command '{cmd_id}' missing required field: {field}")

def validate_device_config(device_config: dict, device_id: str, valid_commands: List[str]) -> None:
    required_fields = ['host', 'username', 'password', 'device_type', 'enabled_commands', 'location_id']
    for field in required_fields:
        if field not in device_config:
            raise ValueError(f"Device '{device_id}' missing required field: {field}")
    
    # Validate that all enabled commands exist
    for cmd in device_config['enabled_commands']:
        if cmd not in valid_commands:
            raise ValueError(f"Device '{device_id}' has invalid command: {cmd}")

def load_and_validate_configs() -> tuple[Dict[str, CommandConfig], Dict[str, DeviceConfig], dict]:
    # Load configurations
    config_dir = Path('/app/config')
    if not config_dir.exists():
        raise FileNotFoundError(f"Config directory not found at {config_dir}")

    commands_config = load_yaml_config(str(config_dir / 'commands.yaml'))
    devices_config = load_yaml_config(str(config_dir / 'devices.yaml'))
    ui_config = load_yaml_config(str(config_dir / 'ui.yaml'))

    # Validate commands
    if 'commands' not in commands_config:
        raise ValueError("commands.yaml is missing the 'commands' key.")
    for cmd_id, cmd_config in commands_config['commands'].items():
        validate_command_config(cmd_config, cmd_id)

    # Validate devices
    if 'devices' not in devices_config:
        raise ValueError("devices.yaml is missing the 'devices' key.")
    valid_commands = list(commands_config['commands'].keys())
    for device_id, device_config in devices_config['devices'].items():
        validate_device_config(device_config, device_id, valid_commands)

    # Create generated directory
    generated_dir = Path(__file__).parent / 'generated'
    generated_dir.mkdir(exist_ok=True)
    
    # Write commands.ts
    with open(generated_dir / 'commands.ts', 'w') as f:
        commands_json = json.dumps(commands_config['commands'], indent=2)
        f.write(f"""import {{ z }} from 'zod';

// Command configuration schema
export const CommandConfigSchema = z.object({{
  type: z.string(),
  label: z.string(),
  template: z.string(),
  description: z.string().optional(),
  subType: z.enum(['path', 'community', 'route']).optional(),
  inputPlaceholder: z.string(),
}});

export type CommandConfig = z.infer<typeof CommandConfigSchema>;

// Commands loaded from YAML configuration
export const COMMANDS: Record<string, CommandConfig> = {commands_json};
""")

    # Write devices.ts
    with open(generated_dir / 'devices.ts', 'w') as f:
        devices_json = json.dumps(devices_config['devices'], indent=2)
        f.write(f"""import {{ z }} from 'zod';
import {{ COMMANDS, CommandConfig }} from './commands';

// Device configuration schema
export const DeviceConfigSchema = z.object({{
  host: z.string(),
  username: z.string(),
  password: z.string(),
  device_type: z.string(),
  description: z.string().optional(),
  enabled_commands: z.array(z.string()),
  location_id: z.string(),
}});

export type DeviceConfig = z.infer<typeof DeviceConfigSchema>;

// Device configurations loaded from YAML
export const DEVICES: Record<string, DeviceConfig> = {devices_json};

// Helper function to get available commands for a device
export function getDeviceCommands(deviceHost: string): CommandConfig[] {{
  const device = DEVICES[deviceHost];
  if (!device) return [];
  
  return device.enabled_commands
    .map(cmdType => COMMANDS[cmdType])
    .filter((cmd): cmd is CommandConfig => cmd !== undefined);
}}
""")

    # Write ui.ts
    with open(generated_dir / 'ui.ts', 'w') as f:
        ui_json = json.dumps(ui_config, indent=2)
        f.write(f"""import {{ z }} from 'zod';

// UI configuration schema
export const UIConfigSchema = z.object({{
  branding: z.object({{
    logo: z.object({{
      light: z.string(),
      dark: z.string(),
    }}),
    header: z.object({{
      title: z.string(),
      subtitle: z.string().optional(),
    }}),
    footer: z.object({{
      text: z.string(),
      links: z.array(z.object({{
        label: z.string(),
        url: z.string(),
      }})),
      contact: z.object({{
        email: z.string(),
        phone: z.string(),
      }}),
    }}),
  }}),
}});

export type UIConfig = z.infer<typeof UIConfigSchema>;

// UI configurations loaded from YAML
export const UI_CONFIG: UIConfig = {ui_json};
""")

    return commands_config['commands'], devices_config['devices'], ui_config

if __name__ == "__main__":
    try:
        commands, devices, ui = load_and_validate_configs()
        print("Configuration loaded and validated successfully!")
        print("Loaded UI configuration with the following sections:")
        print(f"- Logo configurations: {len(ui['branding']['logo'])}")
        print(f"- Footer links: {len(ui['branding']['footer']['links'])}")
    except Exception as e:
        print(f"Configuration error: {str(e)}")
        exit(1)
