import type { Beer } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

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

export function getBeers(): Promise<Beer[]> {
  return request<Beer[]>("/beers");
}

export function getBeer(id: string): Promise<Beer> {
  return request<Beer>(`/beers/${id}`);
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
