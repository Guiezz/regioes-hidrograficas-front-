"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryFilters } from "@/hooks/use-query-filters";

export function DashboardFilters() {
  const { filters, setFilter } = useQueryFilters();
  const [options, setOptions] = useState<{
    eixos: string[];
    programas: string[];
    tipologias: string[];
  }>({
    eixos: [],
    programas: [],
    tipologias: [],
  });

  // Busca as opções dinâmicas da nossa API Go
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/actions/filters?basin_id=${filters.basin_id}`,
    )
      .then((res) => res.json())
      .then((data) => setOptions(data));
  }, [filters.basin_id]);

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-card border rounded-lg shadow-sm">
      {/* Filtro de Bacia - Fixo por enquanto */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase">
          Bacia/Hidrossistema
        </label>
        <Select
          value={filters.basin_id}
          onValueChange={(v) => setFilter("basin_id", v)}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Selecione a Bacia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Curu</SelectItem>
            <SelectItem value="2">Salgado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Eixo */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase">
          Eixo Estratégico
        </label>
        <Select
          value={filters.eixo || "all"}
          onValueChange={(v) => setFilter("eixo", v)}
        >
          <SelectTrigger className="w-50">
            <SelectValue placeholder="Todos os Eixos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Eixos</SelectItem>
            {options.eixos.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Programa */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase">
          Programa
        </label>
        <Select
          value={filters.programa || "all"}
          onValueChange={(v) => setFilter("programa", v)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Todos os Programas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Programas</SelectItem>
            {options.programas
              .filter((p) => p && p.trim() !== "") // <--- ADICIONE ESTA LINHA
              .map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
