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
  MapPin,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
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

export default function PlanosAcaoPage() {
  const { selectedReservoir } = useReservoir();

  const [actions, setActions] = useState<any[]>([]);
  const [filtersData, setFiltersData] = useState<any>({
    eixos: [],
    programas: [],
    tipologias: [],
  });
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
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

  const getTimelineLabel = (start: number, end: number) => {
    if (!start) return "N/A";
    const labels: string[] = [];
    if (intersects(start, end, PRAZOS.curto.inicio, PRAZOS.curto.fim))
      labels.push("Curto");
    if (intersects(start, end, PRAZOS.medio.inicio, PRAZOS.medio.fim))
      labels.push("Médio");
    if (intersects(start, end, PRAZOS.longo.inicio, PRAZOS.longo.fim))
      labels.push("Longo");
    return labels.length ? `${labels.join(" / ")} Prazo` : "N/A";
  };

  const formatBudgetWithUnit = (item: any) => {
    const value = Number(item.total_budget || 0);
    const unit = item.budget_unit || "Global";
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
    return unit === "Global"
      ? formatted
      : `${formatted} / ${unit.toLowerCase()}`;
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
          <Loader2 className="h-8 w-8 animate-spin text-blue-300" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase italic">
            Sincronizando Matriz
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <header className="mb-16 space-y-8">
          <Badge
            variant="outline"
            className="rounded-full border-blue-100 text-blue-600 bg-blue-50/50 px-4 py-1"
          >
            <TrendingUp className="w-3 h-3 mr-2" /> Portfólio de Investimentos
          </Badge>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-none">
                Plano de Ações
              </h1>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium italic">
                  {selectedReservoir?.name
                    ? `Região Hidrográfica do ${selectedReservoir.name}`
                    : "Carregando..."}
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed text-justify max-w-93 lg:max-w-xl">
              Planos de Ação e Previsões de Investimentos estabelecem diretrizes
              para a implementação das iniciativas na região, garantindo a
              execução eficiente das estratégias propostas.
            </p>
          </div>
        </header>

        {/* Filtros */}
        <section className="mb-8 py-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:flex-wrap items-start md:items-end w-93 xl:w-full gap-6">
          <div className="space-y-1.5 w-full md:w-56">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Eixo
            </label>
            <Select
              value={selectedEixo}
              onValueChange={(v) => {
                setSelectedEixo(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-white w-full">
                <SelectValue placeholder="Selecione o Eixo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Eixos</SelectItem>
                {filtersData.eixos?.map((opt: string) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 w-full md:w-48">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Tipologia
            </label>
            <Select
              value={selectedTipo}
              onValueChange={(v) => {
                setSelectedTipo(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-white w-full">
                <SelectValue placeholder="Tipologia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                {filtersData.tipologias?.map((opt: string) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 w-full md:flex-1 md:min-w-[200px]">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Cronograma (Prazo)
            </label>
            <Select
              value={selectedCrono}
              onValueChange={(v) => {
                setSelectedCrono(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-white w-full">
                <SelectValue placeholder="Selecione o Prazo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Prazos</SelectItem>
                <SelectItem value="Curto Prazo">Curto Prazo</SelectItem>
                <SelectItem value="Médio Prazo">Médio Prazo</SelectItem>
                <SelectItem value="Longo Prazo">Longo Prazo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            onClick={() => {
              setSelectedEixo("todos");
              setSelectedTipo("todos");
              setSelectedCrono("todos");
            }}
            className="w-full md:w-auto text-slate-400 hover:text-blue-600 font-bold text-[10px] uppercase md:ml-auto mt-2 md:mt-0"
          >
            <X className="w-3 h-3 mr-2" /> Limpar Filtros
          </Button>
        </section>
        
        <div className="rounded-xl border border-slate-200 shadow-2xl shadow-slate-200/40 bg-white flex flex-col">
          {/* Área de scroll: horizontal + vertical */}
          <div className="overflow-x-auto overflow-y-auto max-h-[480px]">
            <Table className="w-full table-fixed min-w-[700px]">
              {/* Header sticky dentro da área de scroll */}
              <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_0_#e2e8f0]">
                <TableRow className="border-slate-200">
                  <TableHead className="w-[20%] py-4 px-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    Eixo / Programa
                  </TableHead>
                  <TableHead className="w-[32%] py-4 px-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    Ação Estratégica
                  </TableHead>
                  <TableHead className="w-[20%] py-4 px-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    Responsável
                  </TableHead>
                  <TableHead className="w-[14%] py-4 px-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">
                    Investimento
                  </TableHead>
                  <TableHead className="w-[14%] py-4 px-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">
                    Prazo
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-slate-100 hover:bg-blue-50/30 transition-colors"
                    >
                      {/* Eixo / Programa
                          break-words: quebra palavras longas dentro da célula
                          hyphens-auto: adiciona hífen automático quando necessário */}
                      <TableCell className="px-5 py-5 align-top">
                        <div className="text-[9px] font-black text-blue-600 uppercase tracking-wider mb-1 break-words hyphens-auto">
                          {item.axis_name || "Eixo não definido"}
                        </div>
                        <div className="font-bold text-slate-800 text-[11px] leading-tight break-words hyphens-auto mb-2">
                          {item.program?.name || "Programa não definido"}
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter border border-slate-200 px-1.5 py-0.5 rounded max-w-full">
                          {/* shrink-0 no ícone impede que ele seja comprimido */}
                          <Tag className="w-2.5 h-2.5 shrink-0" />
                          {/* truncate corta a tipologia com "..." se for longa demais */}
                          <span className="truncate">{item.typology}</span>
                        </div>
                      </TableCell>

                      {/* Ação Estratégica — break-words para não vazar da célula */}
                      <TableCell className="px-5 py-5 align-top">
                        <p className="text-slate-600 text-sm leading-relaxed text-justify whitespace-normal wrap-break-words">
                          {item.description}
                        </p>
                      </TableCell>

                      {/* Responsável — ícone fixo + texto com quebra */}
                      <TableCell className="px-5 py-5 align-top">
                        <div className="flex items-start gap-2 text-[12px] font-medium text-slate-600 leading-snug">
                          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <span className="wrap-break-word whitespace-normal hyphens-auto">
                            {item.source || "Órgão a definir"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Investimento — whitespace-nowrap: valor monetário nunca quebra */}
                      <TableCell className="px-5 py-5 text-right align-top font-mono font-bold text-slate-900 text-sm whitespace-nowrap">
                        {formatBudgetWithUnit(item)}
                      </TableCell>

                      {/* Prazo — anos nunca quebram */}
                      <TableCell className="px-5 py-5 align-top text-center">
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase border-none px-3 mb-1"
                        >
                          {getTimelineLabel(item.start_year, item.end_year)}
                        </Badge>
                        <div className="text-[10px] text-slate-400 font-mono tracking-tighter whitespace-nowrap">
                          {item.start_year} — {item.end_year}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-40 text-center text-slate-400 italic"
                    >
                      Nenhum resultado para estes filtros.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação — fora da área de scroll, sempre visível */}
          <div className="bg-slate-50/50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Pág. {currentPage} / {totalPages || 1}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 rounded-md border-slate-300 bg-white shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="h-8 w-8 p-0 rounded-md border-slate-300 bg-white shadow-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <footer className="mt-12 flex flex-col md:flex-row justify-between items-center bg-slate-900 rounded-2xl p-10 xl:w-full w-[370px] text-white">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Aporte Total Estimado
            </p>
            <p className="text-4xl font-mono font-bold text-blue-400">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                actions
                  .filter((a) => a.budget_unit === "Global")
                  .reduce((acc, curr) => acc + (curr.total_budget || 0), 0),
              )}
            </p>
            <p className="text-[9px] text-slate-500 italic">
              * Somente custos globais totalizados
            </p>
          </div>
          <div className="h-px w-full md:w-px md:h-12 bg-slate-800 my-6 md:my-0" />
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Volume de Iniciativas
            </p>
            <p className="text-3xl font-bold">
              {actions.length}{" "}
              <span className="text-sm font-light text-slate-400 uppercase">
                ações
              </span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
