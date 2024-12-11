import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Command } from "@/lib/types";

const COMMANDS: Command[] = [
  { type: "ping", label: "Ping" },
  { type: "traceroute", label: "Traceroute" },
  { type: "bgp", label: "BGP AS Path" },
  { type: "bgp", label: "BGP Community" },
  { type: "bgp", label: "BGP Route" },
  { type: "mtr", label: "MTR" }
];

const QUERY_TYPES = {
  "ping": "Enter IP or hostname",
  "traceroute": "Enter IP or hostname",
  "mtr": "Enter IP or hostname",
  "bgp": "Enter IP prefix or ASN"
};

interface CommandSelectorProps {
  selectedCommand: Command | null;
  onCommandSelect: (command: Command) => void;
  queryTarget: string;
  onQueryTargetChange: (value: string) => void;
}

export default function CommandSelector({
  selectedCommand,
  onCommandSelect,
  queryTarget,
  onQueryTargetChange
}: CommandSelectorProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Select
        value={selectedCommand?.type}
        onValueChange={(value) => {
          const command = COMMANDS.find(c => c.type === value);
          if (command) onCommandSelect(command);
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select command" />
        </SelectTrigger>
        <SelectContent>
          {COMMANDS.map((command) => (
            <SelectItem key={command.type} value={command.type}>
              {command.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="Enter IP address or hostname"
        value={queryTarget}
        onChange={(e) => onQueryTargetChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
}
