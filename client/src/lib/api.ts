const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ROUTER = {
  birdMortality: "bird/mortality",
  birdPurchase: "bird/purchase",
  birdSale: "bird/sale",
  eggsProduction: "eggs/production",
  eggsSale: "eggs/sale",
  feedProduction: "feed/production",
  feedPurchase: "feed/purchase",
  feedSale: "feed/sale",
  flock: "flock",
  formula: "formula",
  manure: "manure",
  material: "material",
  other: "other",
  vaccine: "vaccine",
  customer: "customer",
} as const;

export const getAll = async (
  model: keyof typeof ROUTER,
  query?: Record<string, any>
) => {
  const q = query ? new URLSearchParams(query).toString() : "";

  const res = await fetch(`${BASE_URL}/${ROUTER[model]}?${q}`);
  return res.json();
};

export const getOne = async (model: keyof typeof ROUTER, id: string) => {
  const res = await fetch(`${BASE_URL}/${ROUTER[model]}/${id}`);
  return res.json();
};

export const create = async (
  model: keyof typeof ROUTER,
  data: Record<string, any>
) => {
  const res = await fetch(`${BASE_URL}/${ROUTER[model]}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const update = async (
  model: keyof typeof ROUTER,
  id: string,
  data: Record<string, any>
) => {
  const res = await fetch(`${BASE_URL}/${ROUTER[model]}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const remove = async (model: keyof typeof ROUTER, id: string) => {
  const res = await fetch(`${BASE_URL}/${ROUTER[model]}/${id}`, {
    method: "DELETE",
  });

  if (res.status !== 204) {
    throw new Error("Failed to delete");
  }

  return true;
};
