import type { Beer, Order, OrderStatus } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

/** Error tirado por las llamadas admin, incluye el status HTTP para poder distinguir 401 (sesión vencida/inválida). */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function adminRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? `Error ${res.status}`, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export async function login(email: string, password: string): Promise<{ token: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? `Error ${res.status}`, res.status);
  }

  return res.json();
}

export interface BeerInput {
  name: string;
  style: string;
  abv: number;
  ibu?: number;
  description: string;
  imageUrl?: string;
  price: number;
  stock: number;
  active?: boolean;
}

export function getAllBeers(token: string): Promise<Beer[]> {
  return adminRequest<Beer[]>("/beers/admin/all", token);
}

export function createBeer(token: string, data: BeerInput): Promise<Beer> {
  return adminRequest<Beer>("/beers", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateBeer(token: string, id: string, data: Partial<BeerInput>): Promise<Beer> {
  return adminRequest<Beer>(`/beers/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deactivateBeer(token: string, id: string): Promise<void> {
  return adminRequest<void>(`/beers/${id}`, token, { method: "DELETE" });
}

export function getOrders(token: string): Promise<Order[]> {
  return adminRequest<Order[]>("/orders", token);
}

export function updateOrderStatus(token: string, id: string, status: OrderStatus): Promise<Order> {
  return adminRequest<Order>(`/orders/${id}/status`, token, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
