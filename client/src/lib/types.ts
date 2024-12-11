export interface Location {
  id: string;
  city: string;
  code: string;
  shortCode: string;
  deviceHost: string;
}

export interface Command {
  type: 'ping' | 'traceroute' | 'mtr' | 'bgp';
  label: string;
}

export interface DeviceConfig {
  host: string;
  username: string;
  password: string;
  device_type: string;
}
