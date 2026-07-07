export interface DegreeFieldOption {
  id: number;
  name: string;
}

const BACKEND_URL = process.env.BACKEND_URL;

export async function getActiveDegreeFields(): Promise<DegreeFieldOption[]> {
  const res = await fetch(`${BACKEND_URL}/api/public/degree-fields/active`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}