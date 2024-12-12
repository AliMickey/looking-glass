import { z } from 'zod';

// Command configuration schema
export const CommandConfigSchema = z.object({
  type: z.string(),
  label: z.string(),
  template: z.string(),
  description: z.string().optional(),
  subType: z.enum(['path', 'community', 'route']).optional(),
  inputPlaceholder: z.string(),
});

export type CommandConfig = z.infer<typeof CommandConfigSchema>;

// Define all available commands
export const COMMANDS: Record<string, CommandConfig> = {
  "ping": {
    "type": "ping",
    "label": "Ping",
    "template": "ping {target}",
    "description": "Send ICMP echo requests to a target",
    "inputPlaceholder": "Enter IP or hostname"
  },
  "traceroute": {
    "type": "traceroute",
    "label": "Traceroute",
    "template": "traceroute {target}",
    "description": "Print the route packets take to a target",
    "inputPlaceholder": "Enter IP or hostname"
  },
  "mtr": {
    "type": "mtr",
    "label": "MTR",
    "template": "mtr {target}",
    "description": "Continuously traceroute to a target",
    "inputPlaceholder": "Enter IP or hostname"
  },
  "bgp_path": {
    "type": "bgp_path",
    "label": "BGP AS Path",
    "template": "show ip bgp paths {target}",
    "description": "Show BGP AS path information",
    "subType": "path",
    "inputPlaceholder": "Enter IP prefix or ASN"
  },
  "bgp_community": {
    "type": "bgp_community",
    "label": "BGP Community",
    "template": "show ip bgp community {target}",
    "description": "Show BGP community information",
    "subType": "community",
    "inputPlaceholder": "Enter community value"
  },
  "bgp_route": {
    "type": "bgp_route",
    "label": "BGP Route",
    "template": "show ip bgp {target}",
    "description": "Show BGP route information",
    "subType": "route",
    "inputPlaceholder": "Enter IP prefix"
  }
};
