"use client";

import { useEffect, useState } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { getActions } from "@/services/api";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  X,
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Target,
  FileBarChart,
  LayoutList,
} from "lucide-react";

const PRAZOS = {
  curto: { inicio: 2024, fim: 2033 },
  medio: { inicio: 2034, fim: 2043 },
  longo: { inicio: 2044, fim: 2053 },
};

const intersects = (
  start: number,
  end: number,
  rangeStart: number,
  rangeEnd: number,
) => {
  return end >= rangeStart && start <= rangeEnd;
};

export default function MonitoramentoPage() {
  const { selectedReservoir } = useReservoir();

  const [actions, setActions] = useState<any[]>([]);
  const [filtersData, setFiltersData] = useState<any>({
    eixos: [],
    tipologias: [],
  });
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedEixo, setSelectedEixo] = useState("todos");
  const [selectedTipo, setSelectedTipo] = useState("todos");
  const [selectedCrono, setSelectedCrono] = useState("todos");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    async function loadInitialData() {
      if (!selectedReservoir) return;

      setLoading(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

      try {
        const filtersRes = await axios.get(
          `${baseUrl}/actions/filters?basin_id=${selectedReservoir.id}`,
        );
        setFiltersData(filtersRes.data);

        const actionsData = await getActions(selectedReservoir.id, {
          eixo: selectedEixo === "todos" ? "" : selectedEixo,
          tipologia: selectedTipo === "todos" ? "" : selectedTipo,
        });

        const rawList = Array.isArray(actionsData)
          ? actionsData
          : (actionsData as any).data || [];

        // Filtro local de cronograma
        const filteredList = rawList.filter((item: any) => {
          if (selectedCrono === "todos") return true;

          const start = item.start_year || 0;
          const end = item.end_year || start;

          if (selectedCrono === "Curto Prazo") {
            return intersects(
              start,
              end,
              PRAZOS.curto.inicio,
              PRAZOS.curto.fim,
            );
          }
          if (selectedCrono === "Médio Prazo") {
            return intersects(
              start,
              end,
              PRAZOS.medio.inicio,
              PRAZOS.medio.fim,
            );
          }
          if (selectedCrono === "Longo Prazo") {
            return intersects(
              start,
              end,
              PRAZOS.longo.inicio,
              PRAZOS.longo.fim,
            );
          }
          return true;
        });

        setActions(filteredList);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [selectedReservoir, selectedEixo, selectedTipo, selectedCrono]);

  const getLatestIEARel = (item: any) => {
    if (!item.measurements || item.measurements.length === 0) return null;
    const lastMeasurement = item.measurements[item.measurements.length - 1];
    return lastMeasurement.iea_relativo || 0;
  };

  const formatDecimal = (val: number | null) => {
    if (val === null || val === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const getTimelineLabel = (start: number, end: number) => {
    if (!start) return "N/A";
    const labels: string[] = [];
    if (intersects(start, end, PRAZOS.curto.inicio, PRAZOS.curto.fim))
      labels.push("Curto");
    if (intersects(start, end, PRAZOS.medio.inicio, PRAZOS.medio.fim))
      labels.push("Médio");
    if (intersects(start, end, PRAZOS.longo.inicio, PRAZOS.longo.fim))
      labels.push("Longo");
    return labels.join(" / ") + " Prazo";
  };

  const totalPages = Math.ceil(actions.length / itemsPerPage);
  const currentItems = actions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <header className="mb-16 space-y-8">
          <Badge
            variant="outline"
            className="rounded-full border-emerald-200 text-emerald-700 bg-emerald-50/50 px-4 py-1"
          >
            <Activity className="w-3 h-3 mr-2" /> Gestão & Acompanhamento
          </Badge>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
                Monitoramento
              </h1>
              <div className="flex items-center gap-2 text-slate-400">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium italic">
                  {selectedReservoir?.name
                    ? `Região Hidrográfica do ${selectedReservoir.name}`
                    : "Carregando..."}
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed text-justify lg:max-w-xl">
              Acompanhamento detalhado da execução dos Planos de Ação,
              permitindo a visualização de índices de desempenho e status
              atualizado das iniciativas estratégicas da região.
            </p>
          </div>
        </header>

        <section className="mb-8 p-6 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                <LayoutList className="w-3 h-3 inline mr-1 mb-0.5" /> Eixo
                Estratégico
              </label>
              <Select
                value={selectedEixo}
                onValueChange={(v) => {
                  setSelectedEixo(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="bg-white w-full border-emerald-100 focus:ring-emerald-200 h-10">
                  <SelectValue placeholder="Selecione o Eixo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Eixos</SelectItem>
                  {/* CORREÇÃO AQUI TAMBÉM GARANTIDA */}
                  {filtersData.eixos?.map((opt: string) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Cronograma
              </label>
              <Select
                value={selectedCrono}
                onValueChange={(v) => {
                  setSelectedCrono(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="bg-white w-full border-emerald-100 focus:ring-emerald-200 h-10">
                  <SelectValue placeholder="Selecione o Prazo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Prazos</SelectItem>
                  <SelectItem value="Curto Prazo">Curto (até 2033)</SelectItem>
                  <SelectItem value="Médio Prazo">Médio (2034-2043)</SelectItem>
                  <SelectItem value="Longo Prazo">Longo (pós 2043)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Tipologia da Ação
              </label>
              <Select
                value={selectedTipo}
                onValueChange={(v) => {
                  setSelectedTipo(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="bg-white w-full border-emerald-100 focus:ring-emerald-200 h-10">
                  <SelectValue placeholder="Selecione a Tipologia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Tipologias</SelectItem>
                  {filtersData.tipologias?.map((opt: string) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setSelectedEixo("todos");
                setSelectedTipo("todos");
                setSelectedCrono("todos");
              }}
              className="w-full border-dashed border-slate-300 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 h-10 uppercase text-[10px] font-bold tracking-widest"
            >
              <X className="w-3 h-3 mr-2" /> Limpar Filtros
            </Button>
          </div>
        </section>

        {/* Tabela */}
        <div className="rounded-xl border border-slate-200 shadow-xl shadow-slate-200/20 bg-white overflow-hidden mb-16">
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed min-w-250">
              <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                <TableRow>
                  <TableHead className="w-[40%] py-4 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    Ação Estratégica / Descrição
                  </TableHead>
                  <TableHead className="w-[15%] py-4 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    Classificação
                  </TableHead>
                  <TableHead className="w-[15%] py-4 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">
                    Prazo
                  </TableHead>
                  <TableHead className="w-[10%] py-4 px-6 text-[10px] font-black uppercase text-emerald-600 tracking-widest text-center">
                    IEA Rel.
                  </TableHead>
                  <TableHead className="w-[20%] py-4 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">
                    Status Execução
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => {
                    const ieaRel = getLatestIEARel(item);
                    return (
                      <TableRow
                        key={item.id}
                        className="hover:bg-slate-50/50 transition-colors border-slate-100"
                      >
                        <TableCell className="px-6 py-5 align-top">
                          <div className="text-[9px] font-black text-emerald-600 uppercase tracking-wider mb-2">
                            {item.axis_name}
                          </div>
                          <p className="text-sm font-medium text-slate-700 leading-relaxed text-justify whitespace-normal wrap-break-word">
                            {item.description}
                          </p>
                          <span className="text-[9px] text-slate-300 mt-2 block font-mono select-none">
                            ID: #{item.id}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-5 align-top">
                          <Badge
                            variant="outline"
                            className="font-bold text-[9px] border-slate-200 bg-slate-50 text-slate-600 whitespace-normal text-center"
                          >
                            {item.typology}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-6 py-5 align-top text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-black uppercase text-slate-400">
                              {getTimelineLabel(item.start_year, item.end_year)}
                            </span>
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {item.start_year} - {item.end_year}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-5 align-top text-center">
                          {ieaRel !== null ? (
                            <div className="inline-flex items-center justify-center min-w-12 py-1 rounded-md bg-emerald-50 text-emerald-700 font-mono font-bold text-sm border border-emerald-100 shadow-sm">
                              {formatDecimal(ieaRel)}
                            </div>
                          ) : (
                            <span className="text-slate-300 font-mono text-xs">
                              -
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="px-6 py-5 align-top text-right">
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                Em andamento
                              </span>
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                            </div>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-[60%] rounded-full" />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-48 text-center text-slate-400 italic bg-slate-50/30"
                    >
                      Nenhuma ação encontrada para os filtros selecionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="bg-slate-50/80 border-t border-slate-200 px-6 py-4 flex items-center justify-between backdrop-blur-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Pág. {currentPage} / {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 rounded-lg border-slate-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 rounded-lg border-slate-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <section className="border-t border-slate-200 pt-12 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 shadow-sm border border-blue-100">
              <FileBarChart className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              Indicadores Consolidados
            </h2>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center group hover:bg-slate-50 transition-colors cursor-default">
            <BarChart3 className="w-10 h-10 text-slate-300 mx-auto mb-3 group-hover:text-emerald-400 transition-colors" />
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">
              Módulo em Desenvolvimento
            </h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              A visualização detalhada de indicadores por sub-bacia será
              disponibilizada na próxima versão.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
