"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentBasin = searchParams.get("basin_id") || "1";

  const handleBasinChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("basin_id", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center w-full">
      <div className="ml-auto flex items-center gap-4 w-full justify-end">
        <span className="text-sm font-medium text-muted-foreground hidden lg:inline-block">
          Região:
        </span>
        <div className="w-45 md:w-60">
          <Select value={currentBasin} onValueChange={handleBasinChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a bacia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Bacia do Curu</SelectItem>
              <SelectItem value="2">Bacia do Salgado</SelectItem>
              <SelectItem value="3">Metropolitana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
