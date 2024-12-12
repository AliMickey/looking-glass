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
          <h3 className="text-xl font-semibold">{location.deviceName}</h3>
          {location.subtext && (
            <p className="text-sm text-muted-foreground">{location.subtext}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
