"use client";

import { useEffect, useState } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { getCustos } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Calendar, PieChart, Info } from "lucide-react";

export default function CustosPage() {
  const { selectedReservoir } = useReservoir();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!selectedReservoir) return;

      setLoading(true);
      try {
        const res = await getCustos(selectedReservoir.id);
        setData(res || []);
      } catch (error) {
        console.error("Erro ao carregar custos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedReservoir]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-200" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase italic">
            Calculando Investimentos
          </span>
        </div>
      </div>
    );
  }

  const totalGeral = data.find(
    (item) => item.eixo.toUpperCase() === "TOTAL GERAL",
  );
  const custosEixos = data.filter(
    (item) => item.eixo.toUpperCase() !== "TOTAL GERAL",
  );

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-20 lg:py-32">
        {/* Header Editorial */}
        <header className="mb-20 space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-sky-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600">
              Planejamento Financeiro
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[0.95]">
              Custos do Plano
            </h1>
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm tracking-wide">
                {selectedReservoir?.name
                  ? `Região Hidrográfica do ${selectedReservoir.name}`
                  : "Carregando..."}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
            <p className="text-slate-600 text-sm leading-relaxed text-justify max-w-xs lg:max-w-xl">
              O investimento necessário para a implementação dos Planos de Ação
              foi cuidadosamente estimado para garantir a execução das
              estratégias em cada eixo temático. Os valores refletem o
              compromisso com uma gestão hídrica eficiente, considerando
              infraestrutura, preservação e capacitação.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed text-justify max-w-xs lg:max-w-xl">
              O detalhamento por período e eixo garante transparência e apoia o
              planejamento estratégico para captação de recursos. Este somatório
              fornece uma visão clara dos aportes necessários ano a ano,
              assegurando a viabilidade das metas propostas.
            </p>
          </div>
        </header>

        {/* Sistema de Abas Editorial */}
        <Tabs defaultValue="totais" className="space-y-8 w-full">
          {/* O overflow-x-auto permite rolar os botões das abas se a tela for muito pequena */}
          <div className="overflow-x-auto w-full pb-2">
            <TabsList className="bg-slate-50 p-1 rounded-full border border-slate-200 inline-flex min-w-max">
              <TabsTrigger
                value="totais"
                className="rounded-full px-8 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
              >
                <PieChart className="w-4 h-4 mr-2" /> Eixos
              </TabsTrigger>
              <TabsTrigger
                value="periodos"
                className="rounded-full px-8 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Calendar className="w-4 h-4 mr-2" /> Cronograma
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ABA 1: CUSTOS TOTAIS */}
          <TabsContent
            value="totais"
            className="space-y-6 focus-visible:outline-none"
          >
            <div className="rounded-2xl border border-slate-200 shadow-sm bg-white flex flex-col w-full max-w-[calc(100vw-4rem)] md:max-w-full overflow-hidden">
              <div className="overflow-x-auto w-full">
                <Table className="w-full table-fixed min-w-[550px]">
                  <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_0_#e2e8f0]">
                    <TableRow>
                      <TableHead className="w-[40%] py-6 px-6 font-bold text-slate-900">
                        Eixo Temático
                      </TableHead>
                      <TableHead className="w-[40%] py-6 px-6 font-bold text-slate-900 text-right">
                        Valor Total
                      </TableHead>
                      <TableHead className="w-[20%] py-6 px-6 font-bold text-slate-900 text-center">
                        Percentual
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {custosEixos.map((item, idx) => (
                      <TableRow
                        key={idx}
                        className="group hover:bg-blue-50/30 border-slate-100"
                      >
                        <TableCell className="py-6 px-6 font-semibold text-slate-700 whitespace-normal break-words hyphens-auto">
                          {item.eixo}
                        </TableCell>
                        <TableCell className="py-6 px-6 text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                          {item.valor_total}
                        </TableCell>
                        <TableCell className="py-6 px-6 text-center">
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-bold"
                          >
                            {(item.percentual * 100).toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {totalGeral && (
                      <TableRow className="bg-slate-900 hover:bg-slate-800">
                        <TableCell className="py-8 px-6 font-bold text-white uppercase tracking-widest text-xs">
                          Total Geral do Plano
                        </TableCell>
                        <TableCell className="py-8 px-6 text-right font-mono font-bold text-blue-400 text-xl whitespace-nowrap">
                          {totalGeral.valor_total}
                        </TableCell>
                        <TableCell className="py-8 px-6 text-center font-bold text-slate-400 text-sm">
                          100%
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 italic leading-relaxed">
                Os percentuais indicam a distribuição dos recursos entre as
                diferentes áreas de atuação, permitindo identificar onde se
                concentra o maior esforço financeiro do plano hídrico.
              </p>
            </div>
          </TabsContent>

          {/* ABA 2: CUSTOS POR PERÍODO */}
          <TabsContent
            value="periodos"
            className="space-y-6 focus-visible:outline-none"
          >
            <div className="rounded-2xl border border-slate-200 shadow-sm bg-white flex flex-col w-full max-w-[calc(100vw-3rem)] md:max-w-full overflow-hidden">
              <div className="overflow-x-auto w-full">
                <Table className="w-full table-fixed min-w-[850px]">
                  <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_0_#e2e8f0]">
                    <TableRow>
                      <TableHead className="w-[30%] py-6 px-6 font-bold text-slate-900">
                        Eixo
                      </TableHead>
                      <TableHead className="w-[14%] py-6 px-4 font-bold text-slate-900 text-center text-xs uppercase tracking-tighter">
                        2021-2025
                      </TableHead>
                      <TableHead className="w-[14%] py-6 px-4 font-bold text-slate-900 text-center text-xs uppercase tracking-tighter">
                        2025-2030
                      </TableHead>
                      <TableHead className="w-[14%] py-6 px-4 font-bold text-slate-900 text-center text-xs uppercase tracking-tighter">
                        2030-2035
                      </TableHead>
                      <TableHead className="w-[14%] py-6 px-4 font-bold text-slate-900 text-center text-xs uppercase tracking-tighter">
                        2035-2040
                      </TableHead>
                      <TableHead className="w-[14%] py-6 px-4 font-bold text-slate-900 text-center text-xs uppercase tracking-tighter">
                        2040-2045
                      </TableHead>
                      <TableHead className="w-[14%] py-6 px-4 font-bold text-slate-900 text-center text-xs uppercase tracking-tighter">
                        2040-2050
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {custosEixos.map((item, idx) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-slate-50/50 transition-colors border-slate-100"
                      >
                        <TableCell className="py-5 px-6 font-medium text-slate-800 text-sm whitespace-normal wrap-break-word hyphens-auto">
                          {item.eixo}
                        </TableCell>
                        <TableCell className="py-5 px-4 text-center font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {item.p2021_2025}
                        </TableCell>
                        <TableCell className="py-5 px-4 text-center font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {item.p2025_2030}
                        </TableCell>
                        <TableCell className="py-5 px-4 text-center font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {item.p2030_2035}
                        </TableCell>
                        <TableCell className="py-5 px-4 text-center font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {item.p2035_2040}
                        </TableCell>
                        <TableCell className="py-5 px-4 text-center font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {item.p2040_2045}
                        </TableCell>
                        <TableCell className="py-5 px-4 text-center font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {item.p2045_2050}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
              Programação Plurianual — Valores sujeitos a correção monetária
            </p>
          </TabsContent>
        </Tabs>

        {/* Footer Editorial */}
        <footer className="mt-32 pt-12 border-t border-slate-200 flex flex-col items-center gap-6 w-full">
          <div className="w-2 h-2 rounded-full bg-sky-500" />
        </footer>
      </div>
    </div>
  );
}
