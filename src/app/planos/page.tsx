"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getActions, ActionPlan } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Target,
  Filter,
  Coins,
  CalendarDays,
  X,
  ArrowUpRight,
} from "lucide-react";

export default function PlanosAcaoPage() {
  const searchParams = useSearchParams();
  const basinId = searchParams.get("basin_id") || "1";

  const [actions, setActions] = useState<ActionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [filterEixo, setFilterEixo] = useState("todos");
  const [filterTipologia, setFilterTipologia] = useState("todos");
  const [filterCronograma, setFilterCronograma] = useState("todos");

  // Dados Mockados de Exemplo (Caso a API esteja vazia)
  const mockActions: ActionPlan[] = [
    {
      id: 1,
      basin_id: 1,
      axis: "Gestão e Governança",
      description: "Fortalecimento dos Comitês de Bacia",
      typology: "Gestão",
      source: "Tesouro Estadual",
      budget: 150000,
      timeline: "Curto Prazo",
    },
    {
      id: 2,
      basin_id: 1,
      axis: "Infraestrutura",
      description: "Recuperação da Barragem do Açude X",
      typology: "Obra",
      source: "Federal / OGU",
      budget: 2500000,
      timeline: "Médio Prazo",
    },
    {
      id: 3,
      basin_id: 1,
      axis: "Meio Ambiente",
      description: "Reflorestamento de mata ciliar no Rio Curu",
      typology: "Conservação",
      source: "Fundo Ambiental",
      budget: 450000,
      timeline: "Longo Prazo",
    },
    {
      id: 4,
      basin_id: 1,
      axis: "Infraestrutura",
      description: "Construção de Adutora de Engate Rápido",
      typology: "Obra",
      source: "Tesouro Estadual",
      budget: 1200000,
      timeline: "Curto Prazo",
    },
    {
      id: 5,
      basin_id: 1,
      axis: "Gestão e Governança",
      description: "Monitoramento qualitativo da água",
      typology: "Monitoramento",
      source: "Cobrança pelo uso",
      budget: 300000,
      timeline: "Contínuo",
    },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getActions(Number(basinId));
        // Se a API retornar vazio (ainda não implementada), usa o mock
        if (Array.isArray(data) && data.length > 0) {
          setActions(data);
        } else {
          setActions(mockActions);
        }
      } catch (error) {
        console.error("Usando dados de exemplo:", error);
        setActions(mockActions);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [basinId]);

  // Função para pegar o nome da bacia
  const getBasinName = (id: string) => {
    switch (id) {
      case "1":
        return "Bacia do Curu";
      case "2":
        return "Bacia do Salgado";
      case "3":
        return "Região Metropolitana";
      default:
        return "Região Hidrográfica";
    }
  };

  // Lógica de Filtragem
  const filteredActions = actions.filter((item) => {
    const matchEixo = filterEixo === "todos" || item.axis === filterEixo;
    const matchTipologia =
      filterTipologia === "todos" || item.typology === filterTipologia;
    const matchCronograma =
      filterCronograma === "todos" || item.timeline === filterCronograma;
    return matchEixo && matchTipologia && matchCronograma;
  });

  // Extrair opções únicas para os Selects
  const uniqueEixos = Array.from(new Set(actions.map((a) => a.axis)));
  const uniqueTipologias = Array.from(new Set(actions.map((a) => a.typology)));
  const uniqueCronogramas = Array.from(new Set(actions.map((a) => a.timeline)));

  // Formatador de Moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Resetar filtros
  const clearFilters = () => {
    setFilterEixo("todos");
    setFilterTipologia("todos");
    setFilterCronograma("todos");
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center bg-gray-50/50">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-50/30 min-h-screen">
      <div className="w-full max-w-7xl p-6 md:p-10 space-y-10">
        {/* --- Hero Header --- */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 md:p-12 text-white shadow-xl">
          <div className="relative z-10 space-y-6 text-center md:text-left">
            <Badge
              variant="outline"
              className="border-white/30 text-white bg-white/10 px-4 py-1 text-sm uppercase tracking-widest backdrop-blur-md gap-2"
            >
              <Target className="w-4 h-4" />
              Planejamento Estratégico
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Planos de Ação e Investimentos
            </h1>
            <div className="max-w-3xl text-lg text-emerald-50 leading-relaxed font-light text-justify md:text-left">
              Planos de Ação e Previsões de Investimentos estabelecem diretrizes
              para a implementação das iniciativas na
              <span className="font-semibold text-white">
                {" "}
                {getBasinName(basinId)}
              </span>
              , garantindo a execução eficiente das estratégias propostas. Esses
              planos definem prazos, responsabilidades e fontes de financiamento
              para ações prioritárias, assegurando o uso sustentável dos
              recursos hídricos. As previsões contemplam obras de
              infraestrutura, monitoramento, gestão hídrica e medidas de
              conservação.
            </div>
          </div>

          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-teal-900/20 blur-2xl" />
        </div>

        {/* --- Área de Controle (Filtros) --- */}
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-4 border-b">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                <Filter className="h-5 w-5 text-emerald-600" />
                Filtros Avançados
              </CardTitle>

              {(filterEixo !== "todos" ||
                filterTipologia !== "todos" ||
                filterCronograma !== "todos") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Filtro Eixo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Eixo Temático
                </label>
                <Select value={filterEixo} onValueChange={setFilterEixo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o eixo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Eixos</SelectItem>
                    {uniqueEixos.map((eixo) => (
                      <SelectItem key={eixo} value={eixo}>
                        {eixo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Tipologia */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Tipologia da Solução
                </label>
                <Select
                  value={filterTipologia}
                  onValueChange={setFilterTipologia}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de solução" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as Tipologias</SelectItem>
                    {uniqueTipologias.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Cronograma */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Cronograma
                </label>
                <Select
                  value={filterCronograma}
                  onValueChange={setFilterCronograma}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Prazo de execução" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Prazos</SelectItem>
                    {uniqueCronogramas.map((crono) => (
                      <SelectItem key={crono} value={crono}>
                        {crono}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- Tabela de Dados --- */}
        <Card className="border-none shadow-lg bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-emerald-50/50">
                <TableRow>
                  <TableHead className="w-[180px] font-bold text-emerald-900">
                    Eixo
                  </TableHead>
                  <TableHead className="min-w-[300px] font-bold text-emerald-900">
                    Ações Específicas
                  </TableHead>
                  <TableHead className="w-[150px] font-bold text-emerald-900">
                    Tipologia
                  </TableHead>
                  <TableHead className="w-[180px] font-bold text-emerald-900">
                    Fonte de Recursos
                  </TableHead>
                  <TableHead className="w-[180px] font-bold text-emerald-900 text-right">
                    Previsão (R$)
                  </TableHead>
                  <TableHead className="w-[150px] font-bold text-emerald-900 text-center">
                    Cronograma
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActions.length > 0 ? (
                  filteredActions.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-700">
                        {item.axis}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-start gap-2">
                          <ArrowUpRight className="h-4 w-4 text-emerald-400 mt-1 shrink-0" />
                          {item.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          {item.typology}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {item.source}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium text-gray-800">
                        {formatCurrency(item.budget)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={`
                                                ${item.timeline.includes("Curto") ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}
                                                ${item.timeline.includes("Médio") ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : ""}
                                                ${item.timeline.includes("Longo") ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : ""}
                                                ${!item.timeline.includes("Prazo") ? "bg-gray-100 text-gray-700" : ""}
                                            `}
                        >
                          {item.timeline}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-gray-500"
                    >
                      Nenhuma ação encontrada com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Rodapé da Tabela (Resumo) */}
          <div className="bg-gray-50 border-t p-4 flex justify-between items-center text-sm text-gray-500">
            <span>
              Total de Ações:{" "}
              <strong className="text-gray-900">
                {filteredActions.length}
              </strong>
            </span>
            <span>
              Investimento Total (Filtrado):{" "}
              <strong className="text-emerald-700 font-mono text-base">
                {formatCurrency(
                  filteredActions.reduce((acc, curr) => acc + curr.budget, 0),
                )}
              </strong>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
