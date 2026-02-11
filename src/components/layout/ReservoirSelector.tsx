"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReservoir } from "@/context/ReservoirContext";

export function ReservoirSelector() {
  const { reservoirs, selectedReservoir, setSelectedReservoir, isLoading } =
    useReservoir();

  if (isLoading) {
    return <div className="w-45 h-10 bg-muted animate-pulse rounded-md" />;
  }

  return (
    <Select
      value={selectedReservoir?.id.toString()}
      onValueChange={(value) => {
        const reservoir = reservoirs.find((r) => r.id.toString() === value);
        if (reservoir) {
          setSelectedReservoir(reservoir);
        }
      }}
    >
      <SelectTrigger className="w-45 bg-background/50 backdrop-blur-sm border-primary/20">
        <SelectValue placeholder="Selecione..." />
      </SelectTrigger>
      <SelectContent>
        {reservoirs.map((reservoir) => (
          <SelectItem key={reservoir.id} value={reservoir.id.toString()}>
            {reservoir.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
