import type { Beer } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

const MOCK_BEERS: Beer[] = [
  {
    id: "1",
    name: "Macá Golden",
    style: "Golden Ale",
    abv: 4.8,
    ibu: 18,
    description: "Rubia liviana y fácil de tomar, notas a miel y cereal.",
    imageUrl: "/beers/golden.png",
    price: "3200",
    stock: 24,
    active: true,
  },
  {
    id: "2",
    name: "Macá IPA",
    style: "IPA",
    abv: 6.5,
    ibu: 55,
    description: "Amarga y aromática, con lúpulos cítricos y resinosos.",
    imageUrl: "/beers/ipa.png",
    price: "3600",
    stock: 18,
    active: true,
  },
  {
    id: "3",
    name: "Macá Stout",
    style: "Stout",
    abv: 5.5,
    ibu: 32,
    description: "Negra cremosa, notas a café y chocolate torrado.",
    imageUrl: "/beers/brown.png",
    price: "3600",
    stock: 12,
    active: true,
  },
  {
    id: "4",
    name: "Macá Session Lager",
    style: "Lager",
    abv: 4.2,
    ibu: 14,
    description: "Cerveza de sesión, fresca y con final seco.",
    imageUrl: "/beers/sessionlager.png",
    price: "3000",
    stock: 0,
    active: true,
  },
];

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status}`);
  }
  return res.json();
}

export async function getBeers(): Promise<Beer[]> {
  try {
    return await request<Beer[]>("/beers");
  } catch {
    return MOCK_BEERS;
  }
}

export async function getBeer(id: string): Promise<Beer> {
  try {
    return await request<Beer>(`/beers/${id}`);
  } catch {
    const beer = MOCK_BEERS.find((b) => b.id === id);
    if (!beer) throw new Error("Cerveza no encontrada");
    return beer;
  }
}

export interface CreateOrderInput {
  customerName: string;
  address: string;
  zone?: string;
  preferredTime?: string;
  items: { beerId: string; quantity: number }[];
}

export function createOrder(input: CreateOrderInput) {
  return request("/orders", { method: "POST", body: JSON.stringify(input) });
}
