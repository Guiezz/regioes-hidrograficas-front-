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
import { getBasins, Basin } from "@/services/api"; // Importando a nova função

export function DashboardFilters() {
  const { filters, setFilter } = useQueryFilters();

  // Estado para armazenar a lista de bacias vinda da API
  const [basins, setBasins] = useState<Basin[]>([]);

  // Estado para as opções de filtros (Eixos, Programas, etc)
  const [options, setOptions] = useState<{
    eixos: string[];
    programas: string[];
    tipologias: string[];
  }>({
    eixos: [],
    programas: [],
    tipologias: [],
  });

  // 1. Busca as bacias disponíveis no backend ao carregar o componente
  useEffect(() => {
    async function loadBasins() {
      const data = await getBasins();
      setBasins(data);
    }
    loadBasins();
  }, []);

  // 2. Busca as opções dinâmicas (Eixos, Programas) quando a bacia muda
  useEffect(() => {
    // Garante que só busca se tiver um ID de bacia
    const basinId = filters.basin_id || "1";

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/actions/filters?basin_id=${basinId}`,
    )
      .then((res) => res.json())
      .then((data) => setOptions(data))
      .catch((err) => console.error("Erro ao carregar filtros:", err));
  }, [filters.basin_id]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-card border rounded-lg shadow-sm md:flex-row md:flex-wrap">
      {/* Filtro de Bacia - AGORA DINÂMICO */}
      <div className="flex flex-col gap-1.5 w-full md:w-auto">
        <label className="text-xs font-medium text-muted-foreground uppercase">
          Bacia/Hidrossistema
        </label>
        <Select
          value={filters.basin_id?.toString() || "1"}
          onValueChange={(v) => setFilter("basin_id", v)}
        >
          <SelectTrigger className="w-full md:w-45">
            <SelectValue placeholder="Selecione a Bacia" />
          </SelectTrigger>
          <SelectContent>
            {basins.length === 0 ? (
              <SelectItem value="1" disabled>
                Carregando...
              </SelectItem>
            ) : (
              basins.map((basin) => (
                <SelectItem key={basin.ID} value={basin.ID.toString()}>
                  {basin.Name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Eixo */}
      <div className="flex flex-col gap-1.5 w-full md:w-auto">
        <label className="text-xs font-medium text-muted-foreground uppercase">
          Eixo Estratégico
        </label>
        <Select
          value={filters.eixo || "all"}
          onValueChange={(v) => setFilter("eixo", v)}
        >
          <SelectTrigger className="w-full md:w-50">
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
      <div className="flex flex-col gap-1.5 w-full md:w-auto">
        <label className="text-xs font-medium text-muted-foreground uppercase">
          Programa
        </label>
        <Select
          value={filters.programa || "all"}
          onValueChange={(v) => setFilter("programa", v)}
        >
          <SelectTrigger className="w-full md:w-55">
            <SelectValue placeholder="Todos os Programas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Programas</SelectItem>
            {options.programas
              .filter((p) => p && p.trim() !== "")
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
