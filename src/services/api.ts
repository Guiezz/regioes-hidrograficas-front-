const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getActions(params?: string) {
  const res = await fetch(`${API_URL}/actions?${params || "basin_id=1"}`, {
    cache: "no-store",
  });
  return res.json();
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
