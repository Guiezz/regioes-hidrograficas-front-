"use client";

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface RadarData {
  category: string;
  sum_potential: number;
  sum_realized?: number; // Se sua API retornar o realizado também
  percentage?: number;
}

export function TypologyRadar({ data }: { data: RadarData[] }) {
  // Tratamento para garantir que o gráfico não quebre se vier vazio
  const chartData = data && data.length > 0 ? data : [];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Distribuição por Tipologia</CardTitle>
        <CardDescription>
          Comparativo de peso potencial entre as categorias de ação.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[400px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, "auto"]}
                  tick={false}
                  axisLine={false}
                />

                <Radar
                  name="Potencial (Peso)"
                  dataKey="sum_potential"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#1f2937" }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Sem dados para exibir nesta visualização.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
