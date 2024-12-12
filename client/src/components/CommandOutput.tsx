import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CommandOutputProps {
  output?: string;
  error?: string;
  isLoading: boolean;
}

export default function CommandOutput({ output, error, isLoading }: CommandOutputProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!output && !error) {
    return null;
  }

  return (
    <Card className={`p-4 ${error ? 'bg-red-950/90' : 'bg-black/90'}`}>
      <pre className={`font-mono text-sm whitespace-pre-wrap ${error ? 'text-red-400' : 'text-green-400'}`}>
        {error || output}
      </pre>
    </Card>
  );
}
