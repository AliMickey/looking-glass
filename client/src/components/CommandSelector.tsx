import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Command } from "@/lib/types";

const COMMANDS: Command[] = [
  { type: "ping", label: "Ping" },
  { type: "traceroute", label: "Traceroute" },
  { type: "mtr", label: "MTR" },
  { type: "bgp", label: "BGP Route" }
];

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
