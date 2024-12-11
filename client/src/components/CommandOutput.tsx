import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CommandOutputProps {
  output?: string;
  isLoading: boolean;
}

export default function CommandOutput({ output, isLoading }: CommandOutputProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!output) {
    return null;
  }

  return (
    <Card className="bg-black/90 p-4">
      <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
        {output}
      </pre>
    </Card>
  );
}
