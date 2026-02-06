"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getRadarData, getConsolidated } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Loader2, PieChart, Target, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";

interface RadarItem {
  category: string;
  value: number;
}

export default function IndicadoresPage() {
  const searchParams = useSearchParams();
  const basinId = searchParams.get("basin_id") || "1";

  const [chartData, setChartData] = useState<RadarItem[]>([]);
  const [consolidated, setConsolidated] = useState<any>(null);
  const [totalActions, setTotalActions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Buscamos em paralelo: Dados do Gráfico (Radar) e Dados Consolidados (Total/Índice)
        const [radarRes, consolidatedRes] = await Promise.all([
          getRadarData(Number(basinId)),
          getConsolidated(Number(basinId)),
        ]);

        // 1. Processar dados do Radar (Objeto -> Array)
        // O backend retorna: { "Estrutural": 20, "Gestão": 8, ... }
        const formattedRadar = Object.entries(radarRes || {})
          .map(([category, value]) => ({
            category,
            value: Number(value),
          }))
          .sort((a, b) => b.value - a.value); // Ordena para melhor visualização

        setChartData(formattedRadar);

        // 2. Calcula o total de ações somando todos os valores do radar
        const total = Object.values(radarRes || {}).reduce(
          (acc: number, val) => acc + (Number(val) || 0),
          0,
        );
        setTotalActions(total);

        // 3. Salvar dados consolidados (Índice Global, etc)
        setConsolidated(consolidatedRes);
      } catch (error) {
        console.error("Erro ao carregar indicadores:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [basinId]);

  const getBasinName = (id: string) => {
    const names: Record<string, string> = {
      "1": "Curu",
      "2": "Salgado",
      "3": "Metropolitana",
    };
    return `Região Hidrográfica do ${names[id] || "Hidrográfica"}`;
  };

  // Calcula a média global formatada (0.45 -> 45.0%)
  // O backend envia 0 a 1, então multiplicamos por 100
  const globalIndex = consolidated?.indice_global
    ? (consolidated.indice_global * 100).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-violet-100 selection:text-violet-900">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        {/* HEADER */}
        <header className="mb-16 space-y-8">
          <Badge
            variant="outline"
            className="rounded-full border-violet-200 text-violet-700 bg-violet-50/50 px-4 py-1"
          >
            <PieChart className="w-3 h-3 mr-2" /> Inteligência de Dados
          </Badge>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-none">
                Indicadores de Execução
              </h1>
              <div className="flex items-center gap-2 text-slate-400">
                <Target className="w-4 h-4 text-violet-500" />
                <span className="text-sm font-medium italic">
                  {getBasinName(basinId)}
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed text-justify lg:max-w-xl">
              Indicadores de Execução acompanham o desempenho dos Planos de Ação
              nas Regiões Hidrográficas, permitindo avaliar o avanço das
              iniciativas propostas e a efetividade das estratégias
              implementadas. Esses indicadores fornecem uma visão integrada dos
              resultados alcançados, facilitando a identificação de áreas de
              destaque e de pontos que necessitam de ajustes.
            </p>
          </div>
        </header>

        {/* ÁREA DO GRÁFICO RADAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Texto de Apoio e Métricas (Esquerda) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-violet-50 rounded-2xl border border-violet-100">
              <h3 className="text-violet-900 font-bold text-lg mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" /> Performance Global
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed text-justify mb-4">
                O gráfico ao lado apresenta a distribuição do{" "}
                <strong>Volume de Ações (Ponderado)</strong> por tipologia.
                Áreas mais expandidas indicam maior concentração de esforços e
                investimentos estratégicos.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-violet-200">
                <div>
                  <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">
                    Total de Iniciativas
                  </p>
                  <p className="text-2xl font-mono font-bold text-violet-600">
                    {totalActions}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">
                    Índice Global
                  </p>
                  <p className="text-2xl font-mono font-bold text-emerald-600">
                    {globalIndex}%
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-500 text-sm leading-relaxed text-justify">
                Esta visualização permite identificar rapidamente o equilíbrio
                entre as diferentes áreas de atuação (como Infraestrutura vs.
                Gestão) e priorizar recursos onde necessário.
              </p>
            </div>
          </div>

          {/* Gráfico Radar (Direita) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 flex flex-col min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                Distribuição por Volume (Pesos)
              </h4>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded font-mono">
                Pontuação Acumulada
              </span>
            </div>

            <div className="flex-1 w-full min-h-[500px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={chartData}
                  >
                    <PolarGrid stroke="#e2e8f0" strokeWidth={1.5} />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{
                        fill: "#64748b",
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      // Deixamos domain 'auto' pois os pesos podem variar muito entre bacias
                      domain={[0, "auto"]}
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 10,
                      }}
                      axisLine={false}
                    />
                    <Radar
                      name="Volume (Peso)"
                      dataKey="value"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                      strokeWidth={3}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      itemStyle={{
                        color: "#1f2937",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <div className="text-center space-y-2">
                    <Activity className="w-12 h-12 mx-auto opacity-50" />
                    <p className="text-sm">
                      Sem dados para exibir nesta visualização.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
