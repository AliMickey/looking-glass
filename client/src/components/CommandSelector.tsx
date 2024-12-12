import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Command } from "@/lib/types";

import { useQuery } from '@tanstack/react-query';

async function fetchAvailableCommands(deviceHost: string): Promise<Command[]> {
  const response = await fetch(`/api/device/${deviceHost}/commands`);
  if (!response.ok) throw new Error('Failed to fetch commands');
  return response.json();
}

interface CommandSelectorProps {
  deviceHost: string;
  selectedCommand: Command | null;
  onCommandSelect: (command: Command) => void;
  queryTarget: string;
  onQueryTargetChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

import { Button } from "@/components/ui/button";

interface CommandSelectorProps {
  selectedCommand: Command | null;
  onCommandSelect: (command: Command) => void;
  queryTarget: string;
  onQueryTargetChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function CommandSelector({
  selectedCommand,
  onCommandSelect,
  queryTarget,
  onQueryTargetChange,
  onSubmit,
  isLoading
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

      <Button 
        onClick={onSubmit}
        disabled={!selectedCommand || !queryTarget || isLoading}
      >
        {isLoading ? "Running..." : "Execute"}
      </Button>
    </div>
  );
}
