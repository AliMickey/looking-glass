export interface Location {
  id: string;
  city: string;
  code: string;
  shortCode: string;
  deviceHost: string;
}

export interface Command {
  type: string;
  label: string;
  template: string;
  description?: string;
  subType?: 'path' | 'community' | 'route';
  inputPlaceholder: string;
}

export interface DeviceConfig {
  host: string;
  username: string;
  password: string;
  device_type: string;
}
