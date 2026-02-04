const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ActionPlan {
  id: number;
  description: string;
  typology: string;
  source: string;
  budget: number;
  // No backend o campo cost costuma ser 'budget' ou 'cost'
  // Ajuste os nomes abaixo conforme o JSON real do seu Go
  program?: {
    name: string;
    axis: {
      name: string;
    };
  };
  axis?: string; // Fallback para compatibilidade
  timeline: string;
  basin_id: number;
}
export interface ActionsFilters {
  eixo?: string;
  programa?: string;
  tipologia?: string;
}

export async function getActions(
  basinId = 1,
  filters?: ActionsFilters, // Use a interface correta
) {
  try {
    // URL base
    let url = `${API_URL}/actions?basin_id=${basinId}`;

    // 1. Correção: Usar a chave 'eixo' que vem do componente
    if (filters?.eixo && filters.eixo !== "todos")
      url += `&eixo=${encodeURIComponent(filters.eje || filters.eixo)}`;
    // Nota: mantive o fallback caso ainda usem 'eje' em outro lugar, mas o ideal é padronizar.

    // 2. Correção: Adicionar lógica para o 'programa' (que faltava)
    if (filters?.programa && filters.programa !== "todos")
      url += `&programa=${encodeURIComponent(filters.programa)}`;

    // 3. Correção: Usar a chave 'tipologia' que vem do componente
    if (filters?.tipologia && filters.tipologia !== "todos")
      url += `&tipologia=${encodeURIComponent(filters.tipologia)}`;
    // Fallback para 'tipo' caso o código antigo ainda envie assim:
    else if ((filters as any)?.tipo && (filters as any).tipo !== "todos")
      url += `&tipologia=${encodeURIComponent((filters as any).tipo)}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao buscar ações");

    const responseData = await res.json();
    return responseData.data || [];
  } catch (error) {
    console.warn("Erro ao buscar ações, retornando vazio:", error);
    return [];
  }
}

export async function getRadarData(basinId = 1) {
  const res = await fetch(`${API_URL}/dashboard/radar?basin_id=${basinId}`, {
    cache: "no-store",
  });
  return res.json();
}

export async function getConsolidated(basinId = 1) {
  const res = await fetch(
    `${API_URL}/dashboard/consolidated?basin_id=${basinId}`,
    { cache: "no-store" },
  );
  return res.json();
}

export async function getSections(basinId = 1) {
  const res = await fetch(`${API_URL}/content?basin_id=${basinId}`, {
    cache: "no-store",
  });
  return res.json();
}
