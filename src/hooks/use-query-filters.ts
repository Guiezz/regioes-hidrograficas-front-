"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useQueryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    filters: {
      basin_id: searchParams.get("basin_id") || "1",
      eixo: searchParams.get("eixo") || "",
      programa: searchParams.get("programa") || "",
      tipologia: searchParams.get("tipologia") || "",
    },
    setFilter,
  };
}
