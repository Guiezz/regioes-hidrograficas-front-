"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardFilters } from "@/components/dashboard-filters";
import { ConsolidatedCards } from "@/components/consolidated-cards";
import { TypologyRadar } from "@/components/radar-chart";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const basinId = searchParams.get("basin_id") || "1";

  const [consolidated, setConsolidated] = useState<any>(null);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Busca os dados em paralelo para ser mais rápido
        const [resConsolidated, resRadar] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/dashboard/consolidated?basin_id=${basinId}`,
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/dashboard/radar?basin_id=${basinId}`,
          ),
        ]);

        const jsonConsolidated = await resConsolidated.json();
        const jsonRadar = await resRadar.json();

        setConsolidated(jsonConsolidated);

        // A API retorna um objeto map { "Obra": 10, "Estudo": 5 }, precisamos converter para array pro Recharts
        // Se a API já retornar array, ajuste aqui. Assumindo que retorna MAP:
        const radarArray = Object.entries(jsonRadar || {}).map(
          ([key, value]) => ({
            category: key,
            sum_potential: value,
          }),
        );

        setRadarData(radarArray);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [basinId]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Filtros Globais */}
      <DashboardFilters />

      <div className="space-y-4">
        {loading ? (
          <div className="flex h-[400px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Cards de KPIs */}
            <ConsolidatedCards data={consolidated} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Gráfico de Radar (Ocupa 4 colunas) */}
              <TypologyRadar data={radarData} />

              {/* Espaço para outro gráfico futuro (Ocupa 3 colunas) */}
              <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow flex items-center justify-center text-muted-foreground">
                Em breve: Gráfico de Evolução Temporal
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
