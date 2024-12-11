export interface Location {
  id: string;
  city: string;
  code: string;
  shortCode: string;
  deviceHost: string;
}

export interface Command {
  type: 'ping' | 'traceroute' | 'mtr' | 'bgp_path' | 'bgp_community' | 'bgp_route';
  label: string;
  subType?: 'path' | 'community' | 'route';
}

export interface DeviceConfig {
  host: string;
  username: string;
  password: string;
  device_type: string;
}
