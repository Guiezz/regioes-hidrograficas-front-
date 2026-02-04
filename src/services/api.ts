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

export async function getActions(
  basinId = 1,
  filters?: { eje?: string; tipo?: string },
) {
  try {
    // Construção dinâmica da URL com filtros para o Passo 3
    let url = `${API_URL}/actions?basin_id=${basinId}`;
    if (filters?.eje && filters.eje !== "todos")
      url += `&eixo=${encodeURIComponent(filters.eje)}`;
    if (filters?.tipo && filters.tipo !== "todos")
      url += `&tipologia=${encodeURIComponent(filters.tipo)}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao buscar ações");

    const responseData = await res.json();

    // Extraímos a lista da chave 'data' enviada pelo backend em Go
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
