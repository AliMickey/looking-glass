import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Location } from "@/lib/types";

interface LocationCardProps {
  location: Location;
  selected: boolean;
  onSelect: () => void;
}

export default function LocationCard({ location, selected, onSelect }: LocationCardProps) {
  return (
    <Card
      className={cn(
        "p-6 cursor-pointer transition-colors",
        "hover:bg-primary/10",
        selected && "border-primary bg-primary/5"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{location.city}</h3>
          <p className="text-sm text-muted-foreground">{location.code}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-mono">{location.shortCode}</span>
        </div>
      </div>
    </Card>
  );
}
