"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getMatriz } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  MapPin,
  ClipboardList,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

export default function MatrizPage() {
  const searchParams = useSearchParams();
  const basinId = searchParams.get("basin_id") || "1";

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTipo, setFilterTipo] = useState("all");
  const [filterPrograma, setFilterPrograma] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getMatriz(Number(basinId));
        setData(res || []);
      } catch (error) {
        console.error("Erro ao carregar matriz:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [basinId]);

  // Resetar página quando os filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [filterTipo, filterPrograma]);

  const tiposMatriz = useMemo(
    () =>
      Array.from(new Set(data.map((item) => item.tipo_matriz))).filter(
        (t): t is string => typeof t === "string" && t.trim() !== "",
      ),
    [data],
  );

  const programas = useMemo(
    () =>
      Array.from(new Set(data.map((item) => item.programa))).filter(
        (p): p is string => typeof p === "string" && p.trim() !== "",
      ),
    [data],
  );

  const filteredData = data.filter((item) => {
    const matchTipo = filterTipo === "all" || item.tipo_matriz === filterTipo;
    const matchProg =
      filterPrograma === "all" || item.programa === filterPrograma;
    return matchTipo && matchProg;
  });

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getPriorityBadge = (priority: string) => {
    const p = priority?.toLowerCase() || "";
    if (p.includes("alta"))
      return <Badge className="bg-red-500 hover:bg-red-600">Alta</Badge>;
    if (p.includes("méd") || p.includes("med"))
      return <Badge className="bg-amber-500 hover:bg-amber-600">Média</Badge>;
    return <Badge className="bg-emerald-500 hover:bg-emerald-600">Baixa</Badge>;
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-200" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase italic">
            Carregando Matriz de Ações
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        {/* Header Editorial */}
        <header className="mb-20 space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-sky-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600">
              Planejamento Estratégico
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[0.95]">
              Matriz de Ações
            </h1>
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm tracking-wide">
                Região Hidrográfica do Curu
              </span>
            </div>
          </div>

          <p className="text-xl text-slate-500 font-light leading-relaxed text-justify">
            A matriz de ações define as prioridades operacionais para a gestão
            dos recursos hídricos, vinculando programas a ações específicas e
            seus responsáveis.
          </p>
        </header>

        {/* Filtros */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Tipo de Matriz
            </label>
            <Select onValueChange={setFilterTipo} defaultValue="all">
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                {tiposMatriz.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <ClipboardList className="w-3 h-3" /> Programa
            </label>
            <Select onValueChange={setFilterPrograma} defaultValue="all">
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Selecione o programa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Programas</SelectItem>
                {programas.map((prog) => (
                  <SelectItem key={prog} value={prog}>
                    {prog}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Tabela */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm mb-6">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="py-6 font-bold text-slate-900">
                  Ação Específica
                </TableHead>
                <TableHead className="py-6 font-bold text-slate-900">
                  Responsáveis
                </TableHead>
                <TableHead className="py-6 font-bold text-slate-900 text-center w-[120px]">
                  Prioridade
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-blue-50/30">
                    <TableCell className="py-6 align-top">
                      <div className="space-y-1">
                        <p className="text-[15px] font-semibold text-slate-800 leading-snug whitespace-normal break-words">
                          {item.acoes_especificas}
                        </p>
                        <p className="text-[11px] text-blue-500 font-bold uppercase tracking-wider">
                          {item.programa}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 align-top">
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-normal break-words">
                        {item.instituicoes_envolvidas}
                      </p>
                    </TableCell>
                    <TableCell className="py-6 align-top text-center">
                      {getPriorityBadge(item.prioridade)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-40 text-center text-slate-400 italic"
                  >
                    Nenhuma ação encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Controles de Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-slate-500">
              Página <span className="font-medium">{currentPage}</span> de{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Próxima <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        <footer className="mt-20 pt-8 border-t border-slate-200 flex flex-col items-center gap-4 text-center">
          <div className="w-2 h-2 rounded-full bg-sky-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 italic">
            Plano de Recursos Hídricos — Matriz de Ações
          </p>
        </footer>
      </div>
    </div>
  );
}
