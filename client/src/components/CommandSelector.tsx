import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Command } from "@/lib/types";

const COMMANDS: Command[] = [
  { type: "ping", label: "Ping" },
  { type: "traceroute", label: "Traceroute" },
  { type: "bgp_path", label: "BGP AS Path", subType: "path" },
  { type: "bgp_community", label: "BGP Community", subType: "community" },
  { type: "bgp_route", label: "BGP Route", subType: "route" },
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
        placeholder={selectedCommand ? QUERY_TYPES[selectedCommand.type.split('_')[0]] : "Select a command first"}
        value={queryTarget}
        onChange={(e) => onQueryTargetChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
}
