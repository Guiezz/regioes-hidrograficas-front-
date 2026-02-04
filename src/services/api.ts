const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ActionPlan {
  id: number;
  axis: string; // Eixo
  description: string; // Ação Específica
  typology: string; // Tipologia
  source: string; // Fonte de Recursos
  budget: number; // Previsão Orçamentária
  timeline: string; // Cronograma (Curto, Médio, Longo)
  basin_id: number;
}

export async function getActions(basinId = 1) {
  try {
    const res = await fetch(`${API_URL}/actions?basin_id=${basinId}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Falha ao buscar ações");
    return res.json();
  } catch (error) {
    console.warn("API de ações não disponível, usando dados de exemplo.");
    return []; // Retorna vazio para cair no fallback do componente
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
