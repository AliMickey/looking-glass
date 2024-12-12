import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import LocationCard from "@/components/LocationCard";
import CommandSelector from "@/components/CommandSelector";
import CommandOutput from "@/components/CommandOutput";
import { Location, Command } from "@/lib/types";

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [queryTarget, setQueryTarget] = useState<string>("");

  const { data: locations } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await fetch('/api/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      return response.json();
    },
  });

  const [shouldExecute, setShouldExecute] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<{ output: string; error?: string }>({
    queryKey: ['execute', selectedLocation?.id, selectedCommand?.type, queryTarget],
    queryFn: async () => {
      const response = await fetch(`/api/execute?locationId=${selectedLocation?.id}&command=${selectedCommand?.type}&target=${encodeURIComponent(queryTarget)}`);
      if (!response.ok) throw new Error('Failed to execute command');
      return response.json();
    },
    enabled: false,
  });

  const handleExecute = () => {
    setShouldExecute(true);
  };

  const output = data?.output;
  const errorMessage = error instanceof Error ? error.message : data?.error;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Looking Glass</h1>
          <div className="text-sm text-muted-foreground">Location</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations?.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              selected={selectedLocation?.id === location.id}
              onSelect={() => setSelectedLocation(location)}
            />
          ))}
        </div>

        {selectedLocation && (
          <Card className="p-6 space-y-4">
            <CommandSelector
              deviceHost={selectedLocation.deviceHost}
              selectedCommand={selectedCommand}
              onCommandSelect={(cmd) => {
                setSelectedCommand(cmd);
                setShouldExecute(false);
              }}
              queryTarget={queryTarget}
              onQueryTargetChange={(val) => {
                setQueryTarget(val);
                setShouldExecute(false);
              }}
              onSubmit={() => {
                setShouldExecute(true);
                refetch();
              }}
              isLoading={isLoading}
            />

            <CommandOutput 
              output={output}
              error={errorMessage}
              isLoading={isLoading}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
