"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardFilters } from "@/components/dashboard-filters";
import { Badge } from "@/components/ui/badge";

// Interface para tipar os dados (opcional, mas recomendado)
interface Action {
  id: number;
  description: string;
  typology: string;
  pdp_weight: number;
  execution_perc: number;
  iea: number;
}

export default function MatrizPage() {
  const searchParams = useSearchParams();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Flag para evitar atualizar o estado se o componente desmontar
    // ou se o usuário mudar o filtro antes da requisição anterior terminar
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/actions?${searchParams.toString()}`,
        );
        const json = await res.json();

        if (isMounted) {
          setActions(json.data || []);
        }
      } catch (error) {
        console.error("Erro ao buscar ações:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Função de limpeza (cleanup)
    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Matriz de Ação</h1>

      <DashboardFilters />

      <div className="border rounded-md bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Descrição da Ação</TableHead>
              <TableHead>Tipologia</TableHead>
              <TableHead className="text-center">Peso</TableHead>
              <TableHead className="text-center">Execução</TableHead>
              <TableHead className="text-right">IEA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Skeleton simples de loading
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-8 mx-auto bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-12 mx-auto bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-10 ml-auto bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : actions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma ação encontrada para os filtros selecionados.
                </TableCell>
              </TableRow>
            ) : (
              actions.map((acao) => (
                <TableRow key={acao.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    #{acao.id}
                  </TableCell>
                  <TableCell className="max-w-[500px] leading-relaxed">
                    {acao.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {acao.typology}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {acao.pdp_weight}
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {(acao.execution_perc * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-right font-bold text-blue-600 font-mono">
                    {acao.iea.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
