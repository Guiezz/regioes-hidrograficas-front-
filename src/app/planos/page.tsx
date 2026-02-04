"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

export default function PlanosAcaoPage() {
  const searchParams = useSearchParams();
  const basinId = searchParams.get("basin_id") || "1";

  const [actions, setActions] = useState<any[]>([]);
  const [filtersData, setFiltersData] = useState<any>({
    eixos: [],
    programas: [], // Mantido caso precise no futuro, mas não usado no filtro
    tipologias: [],
  });
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros selecionados
  // REMOVIDO: selectedProg
  const [selectedEixo, setSelectedEixo] = useState("todos");
  const [selectedTipo, setSelectedTipo] = useState("todos");
  const [selectedCrono, setSelectedCrono] = useState("todos"); // Novo foco

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Helpers para lógica de datas
  const isCurtoPrazo = (year: number) => year <= 2033;
  const isMedioPrazo = (year: number) => year > 2033 && year <= 2043;
  const isLongoPrazo = (year: number) => year > 2043;

  // Busca dados da API e aplica filtros locais
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

      try {
        // 1. Busca os Filtros dinâmicos (para preencher os combos de Eixo e Tipologia)
        const filtersRes = await axios.get(
          `${baseUrl}/actions/filters?basin_id=${basinId}`,
        );
        setFiltersData(filtersRes.data);

        // 2. Busca as Ações da API
        // Passamos apenas Eixo e Tipologia para a API filtrar (se o backend suportar).
        // Removemos 'programa' pois foi substituído na tela.
        const actionsData = await getActions(Number(basinId), {
          eixo: selectedEixo === "todos" ? "" : selectedEixo,
          tipologia: selectedTipo === "todos" ? "" : selectedTipo,
        });

        const rawList = Array.isArray(actionsData)
          ? actionsData
          : (actionsData as any).data || [];

        // 3. Aplicação do Filtro de Cronograma no Front-end
        // Filtramos a lista recebida baseada no ano de início (start_year)
        const filteredList = rawList.filter((item: any) => {
          if (selectedCrono === "todos") return true;

          const start = item.start_year || 0;

          if (selectedCrono === "Curto Prazo") return isCurtoPrazo(start);
          if (selectedCrono === "Médio Prazo") return isMedioPrazo(start);
          if (selectedCrono === "Longo Prazo") return isLongoPrazo(start);

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
  }, [basinId, selectedEixo, selectedTipo, selectedCrono]); // Dependências atualizadas

  // Regra de negócio para converter anos em Prazos (Labels visuais)
  const getTimelineLabel = (start: number) => {
    if (!start) return "N/A";
    if (start <= 2033) return "Curto Prazo";
    if (start <= 2043) return "Médio Prazo";
    return "Longo Prazo";
  };

  // Formatação de custo com Unidade
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

  // Paginação
  const totalPages = Math.ceil(actions.length / itemsPerPage);
  const currentItems = actions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getBasinName = (id: string) => {
    const names: Record<string, string> = {
      "1": "Curu",
      "2": "Salgado",
      "3": "Metropolitana",
    };
    return `Bacia do ${names[id] || "Hidrográfica"}`;
  };

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
        <header className="mb-20 space-y-10 text-center md:text-left">
          <Badge
            variant="outline"
            className="rounded-full border-blue-100 text-blue-600 bg-blue-50/50 px-4 py-1"
          >
            <TrendingUp className="w-3 h-3 mr-2" /> Portfólio de Investimentos
          </Badge>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-none">
              Plano de Ações
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium italic">
                {getBasinName(basinId)}
              </span>
            </div>
          </div>
        </header>

        {/* Filtros Ajustados */}
        <section className="mb-8 p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-wrap items-end gap-6">
          {/* Filtro: Eixo */}
          <div className="space-y-1.5 w-55">
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

          {/* Filtro: Tipologia */}
          <div className="space-y-1.5 w-45">
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

          {/* Filtro: Cronograma (Substituindo Programa) */}
          <div className="space-y-1.5 flex-1 min-w-50">
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
                <SelectItem value="Curto Prazo">
                  Curto Prazo (até 2033)
                </SelectItem>
                <SelectItem value="Médio Prazo">
                  Médio Prazo (2034 - 2043)
                </SelectItem>
                <SelectItem value="Longo Prazo">
                  Longo Prazo (após 2043)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão Limpar */}
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedEixo("todos");
              setSelectedTipo("todos");
              setSelectedCrono("todos"); // Reseta o cronograma
            }}
            className="text-slate-400 hover:text-blue-600 font-bold text-[10px] uppercase ml-auto"
          >
            <X className="w-3 h-3 mr-2" /> Limpar Filtros
          </Button>
        </section>

        {/* Tabela de Resultados */}
        <div className="rounded-xl border border-slate-200 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed min-w-[1200px]">
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-slate-200">
                  <TableHead className="w-[20%] py-5 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    Eixo / Programa
                  </TableHead>
                  <TableHead className="w-[30%] py-5 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    Ação Estratégica
                  </TableHead>
                  <TableHead className="w-[20%] py-5 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    Responsável
                  </TableHead>
                  <TableHead className="w-[15%] py-5 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">
                    Investimento
                  </TableHead>
                  <TableHead className="w-[15%] py-5 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">
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
                      <TableCell className="px-6 py-6 align-top">
                        {/* Exibição do Eixo (campo virtual axis_name) e Programa */}
                        <div className="text-[9px] font-black text-blue-600 uppercase tracking-wider mb-1">
                          {item.axis_name || "Eixo não definido"}
                        </div>
                        <div className="font-bold text-slate-800 text-[11px] leading-tight whitespace-normal break-words mb-2">
                          {item.program?.name || "Programa não definido"}
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter border border-slate-200 px-1.5 py-0.5 rounded">
                          <Tag className="w-2.5 h-2.5" /> {item.typology}
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-6 align-top">
                        <p className="text-slate-600 text-sm leading-relaxed text-justify whitespace-normal break-words">
                          {item.description}
                        </p>
                      </TableCell>

                      <TableCell className="px-6 py-6 align-top">
                        <div className="flex items-start gap-2 text-[12px] font-medium text-slate-600 whitespace-normal break-words leading-snug">
                          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <span>{item.source || "Órgão a definir"}</span>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-6 text-right align-top font-mono font-bold text-slate-900 text-sm">
                        {formatBudgetWithUnit(item)}
                      </TableCell>

                      <TableCell className="px-6 py-6 align-top text-center">
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase border-none px-3 mb-1"
                        >
                          {getTimelineLabel(item.start_year)}
                        </Badge>
                        <div className="text-[10px] text-slate-400 font-mono tracking-tighter">
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

          {/* Paginação */}
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

        {/* Totalizador Rodapé */}
        <footer className="mt-12 flex flex-col md:flex-row justify-between items-center bg-slate-900 rounded-2xl p-10 text-white">
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
