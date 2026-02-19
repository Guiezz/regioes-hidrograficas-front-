import axios from "axios";

console.log("--- DEBUG DE AMBIENTE ---");
console.log("Variável lida:", process.env.NEXT_PUBLIC_API_URL);
console.log("Ambiente:", process.env.NODE_ENV);
// 1. Configuração da instância do axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
});

// Interfaces
export interface ActionPlan {
  id: number;
  description: string;
  typology: string;
  source: string;
  budget: number;
  program?: {
    name: string;
    axis: {
      name: string;
    };
  };
  axis?: string;
  timeline: string;
  basin_id: number;
}

export interface ActionsFilters {
  eixo?: string;
  programa?: string;
  tipologia?: string;
}

export interface Basin {
  ID: number;
  Name: string;
}

/**
 * Funções de Serviço
 */

export const getBasins = async () => {
  const response = await api.get<Basin[]>("/basins");
  return response.data;
};

export const getBasinById = async (id: string) => {
  const response = await api.get<Basin>(`/basins/${id}`);
  return response.data;
};

export interface ReservoirData {
  id: number;
  name: string;
  // Adicione outros campos que o backend retorna se necessário
}

// Busca as ações com filtros (usando a instância api)
export async function getActions(basinId = 1, filters?: ActionsFilters) {
  try {
    const params: any = { basin_id: basinId };

    if (filters?.eixo && filters.eixo !== "todos") params.eixo = filters.eixo;
    if (filters?.programa && filters.programa !== "todos")
      params.programa = filters.programa;
    if (filters?.tipologia && filters.tipologia !== "todos")
      params.tipologia = filters.tipologia;

    const res = await api.get("/actions", { params });
    // Ajuste conforme a estrutura de retorno do seu backend (responseData.data ou res.data)
    return res.data.data || res.data || [];
  } catch (error) {
    console.warn("Erro ao buscar ações:", error);
    return [];
  }
}

// ... imports

// Substitua a função getReservoirs antiga por esta:
export const getReservoirs = async (): Promise<ReservoirData[]> => {
  try {
    // Usa a instância 'api' (axios) para aproveitar a baseURL configurada
    const response = await api.get<ReservoirData[]>("/basins");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar reservatórios:", error);
    return [];
  }
};

// Dados do gráfico Radar
export async function getRadarData(basinId = 1) {
  const res = await api.get("/dashboard/radar", {
    params: { basin_id: basinId },
  });
  return res.data;
}

// Dados Consolidados (Cards)
export async function getConsolidated(basinId = 1) {
  const res = await api.get("/dashboard/consolidated", {
    params: { basin_id: basinId },
  });
  return res.data;
}

// Conteúdo das Seções (Textos do plano)
export async function getSections(basinId = 1) {
  const res = await api.get("/content", { params: { basin_id: basinId } });
  return res.data;
}

// Matriz de Ações (Financeiro)
// No seu src/services/api.ts, atualize a função getMatriz:

export const getMatriz = async (basinId?: number) => {
  try {
    const params = basinId ? { basin_id: basinId } : {};
    const response = await api.get("/financeiro/matriz", { params });

    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Erro ao buscar matriz:", error);
    return [];
  }
};
// Custos (Financeiro)
export const getCustos = async (basinId?: number) => {
  try {
    const response = await api.get("/financeiro/custos", {
      params: { basin_id: basinId },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar custos:", error);
    return [];
  }
};

export default api;
